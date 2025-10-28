import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { Search, CheckCircle, Clock, DollarSign } from "lucide-react";
import { useTestSetList } from "@hooks/useTestSet";
import { TestSetEntity } from "@models/testSet/entity";
// no direct create here; selection bubbles up
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/Select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/Card";
import { Badge } from "@ui/Badge";
import { Input } from "@ui/Input";

interface SelectTestSetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTestSet: (testSet: TestSetEntity) => void;
  lessonId: number;
  lessonLevel: number;
}

const SelectTestSetDialog: React.FC<SelectTestSetDialogProps> = ({
  isOpen,
  onClose,
  onSelectTestSet,
  lessonLevel,
}) => {
  useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTestType, setSelectedTestType] = useState<string | undefined>(
    undefined
  );
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );

  // Infinite scroll state
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(20);
  const [allTestSets, setAllTestSets] = useState<TestSetEntity[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter testSets by lesson level
  const [dialogKey, setDialogKey] = useState<number>(0);

  const memoizedFilters = useMemo(
    () => ({
      levelN: lessonLevel,
      search: searchTerm || undefined,
      testType: selectedTestType as
        | "VOCABULARY"
        | "GRAMMAR"
        | "KANJI"
        | "LISTENING"
        | "READING"
        | "SPEAKING"
        | "GENERAL"
        | undefined,
      status: selectedStatus as "DRAFT" | "ACTIVE" | "INACTIVE" | undefined,
      pageSize: itemsPerPage,
      currentPage: page,
    }),
    [
      lessonLevel,
      searchTerm,
      selectedTestType,
      selectedStatus,
      itemsPerPage,
      page,
    ]
  );

  const {
    data: testSets,
    isLoading,
    pagination,
  } = useTestSetList(memoizedFilters, {
    enabled: isOpen,
    forceKey: dialogKey,
    refetchOnMount: "always",
  });
  const handleSelectTestSet = (testSet: TestSetEntity) => {
    onSelectTestSet(testSet);
    onClose();
  };

  const getTestTypeLabel = (testType: string) => {
    const labels: Record<string, string> = {
      VOCABULARY: "Từ vựng",
      GRAMMAR: "Ngữ pháp",
      KANJI: "Kanji",
      LISTENING: "Nghe",
      READING: "Đọc",
      SPEAKING: "Nói",
      GENERAL: "Tổng hợp",
    };
    return labels[testType] || testType;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      DRAFT: "Nháp",
      ACTIVE: "Hoạt động",
      INACTIVE: "Không hoạt động",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-yellow-100 text-yellow-800",
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Reset pagination when dialog opens or filters change
  useEffect(() => {
    if (isOpen) {
      setDialogKey((k) => k + 1);
      setPage(1);
      setAllTestSets([]);
      setHasMore(true);
      setIsLoadingMore(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen, searchTerm, selectedTestType, selectedStatus, lessonLevel]);

  // Append or replace data when fetched
  useEffect(() => {
    if (isLoading) return;
    if (!testSets) return;

    setAllTestSets((prev) => {
      if (page === 1) {
        const isSame =
          prev.length === testSets.length &&
          prev.every((v, i) => v.id === testSets[i].id);
        return isSame ? prev : testSets;
      }
      // append without duplicates
      const prevIds = new Set(prev.map((p) => p.id));
      const toAppend = testSets.filter((t) => !prevIds.has(t.id));
      if (toAppend.length === 0) return prev;
      return [...prev, ...toAppend];
    });

    const totalPages = pagination?.totalPage || 1;
    setHasMore(page < totalPages);
    setIsLoadingMore(false);
  }, [isLoading, page, testSets, pagination?.totalPage]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isLoading) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [isLoadingMore, hasMore, isLoading]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    if (isNearBottom) {
      loadMore();
    }
  }, [loadMore]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col bg-white">
        <DialogHeader>
          <DialogTitle>
            Chọn TestSet cho bài học (JLPT N{lessonLevel})
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm testset..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select
            value={selectedTestType}
            onValueChange={(v) =>
              setSelectedTestType(v === "ALL" ? undefined : v)
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Loại đề thi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả loại</SelectItem>
              <SelectItem value="VOCABULARY">Từ vựng</SelectItem>
              <SelectItem value="GRAMMAR">Ngữ pháp</SelectItem>
              <SelectItem value="KANJI">Kanji</SelectItem>
              <SelectItem value="LISTENING">Nghe</SelectItem>
              <SelectItem value="READING">Đọc</SelectItem>
              <SelectItem value="SPEAKING">Nói</SelectItem>
              <SelectItem value="GENERAL">Tổng hợp</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus}
            onValueChange={(v) =>
              setSelectedStatus(v === "ALL" ? undefined : v)
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="DRAFT">Nháp</SelectItem>
              <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* TestSets List - only this section scrolls */}
        <div
          ref={scrollContainerRef}
          className="max-h-[60vh] overflow-y-auto pr-1"
        >
          <div className="grid gap-4">
            {isLoading && page === 1 ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : allTestSets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy testset nào phù hợp
              </div>
            ) : (
              <div className="grid gap-4">
                {allTestSets.map((testSet) => (
                  <Card
                    key={testSet.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleSelectTestSet(testSet)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {testSet.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {testSet.description}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(testSet.status)}>
                            {getStatusLabel(testSet.status)}
                          </Badge>
                          <Badge variant="outline">N{testSet.levelN}</Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          {getTestTypeLabel(testSet.testType)}
                        </div>

                        {testSet.price && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {testSet.price.toLocaleString()} VNĐ
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(testSet.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {testSet.content && (
                        <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {testSet.content.length > 200
                            ? `${testSet.content.substring(0, 200)}...`
                            : testSet.content}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {isLoadingMore && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                )}
                {!hasMore && allTestSets.length > 0 && (
                  <div className="text-center py-4 text-sm text-gray-500">
                    Đã tải hết
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectTestSetDialog;
