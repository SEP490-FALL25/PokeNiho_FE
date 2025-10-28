import React, { useState } from "react";
import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import { Textarea } from "@ui/Textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/Dialog";
import testSetService from "@services/testSet";
import { useTestSet } from "@hooks/useTestSet";
import { TestSetCreateRequest } from "@models/testSet/request";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Badge } from "@ui/Badge";
import { Skeleton } from "@ui/Skeleton";
import { Search, DollarSign } from "lucide-react";
import HeaderAdmin from "@organisms/Header/Admin";
import PaginationControls from "@ui/PaginationControls";

const TestSetManagement: React.FC = () => {
  const {
    testSets,
    isLoading,
    filters,
    pagination,
    handleSearch,
    handleFilterByLevel,
    handleFilterByTestType,
    handleFilterByStatus,
    handlePageChange,
    handlePageSizeChange,
  } = useTestSet();
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    nameVi: "Đề thi từ vựng N3 - Phần 1",
    nameEn: "N3 Vocabulary Test - Part 1",
    descriptionVi:
      "Bộ đề thi từ vựng N3 bao gồm 50 câu hỏi về từ vựng cơ bản trong tiếng Nhật",
    descriptionEn:
      "N3 vocabulary test with 50 basic vocabulary questions in Japanese",
    content:
      "２月１４日は、日本ではバレンタインデーです。キリスト教の特別な日ですが、日本では、女の人が好きな人にチョコレートなどのプレゼントをする日になりました。世界にも同じような日があります。ブラジルでは、６月１２日が「恋人の日」と呼ばれる日です。その日は、男の人も女の人もプレゼントを用意して、恋人におくります。 ブラジルでは、日本のようにチョコレートではなく、写真立てに写真を入れて、プレゼントするそうです。",
    audioUrl:
      "https://storage.googleapis.com/pokenihongo-audio/testset-n3-vocab-instruction.mp3",
    price: 50000,
    levelN: 3,
    testType: "VOCABULARY" as TestSetCreateRequest["testType"],
    status: "DRAFT" as TestSetCreateRequest["status"],
  });

  const openCreate = () => {
    setSelectedId(null);
    setForm({
      nameVi: "",
      nameEn: "",
      descriptionVi: "",
      descriptionEn: "",
      content: "",
      audioUrl: "",
      price: 0,
      levelN: 3,
      testType: "VOCABULARY",
      status: "DRAFT",
    });
    setIsDialogOpen(true);
  };

  const openEdit = (id: number) => {
    const item = testSets.find((t) => t.id === id);
    if (!item) return;
    setForm({
      nameVi: item.name,
      nameEn: item.name,
      descriptionVi: item.description,
      descriptionEn: item.description,
      content: item.content,
      audioUrl: item.audioUrl || "",
      price: item.price || 0,
      levelN: item.levelN,
      testType: item.testType,
      status: item.status,
    });
    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const body = {
      content: form.content,
      meanings: [
        {
          field: "name" as const,
          translations: { vi: form.nameVi, en: form.nameEn },
        },
        {
          field: "description" as const,
          translations: { vi: form.descriptionVi, en: form.descriptionEn },
        },
      ],
      audioUrl: form.audioUrl,
      price: form.price,
      levelN: form.levelN,
      testType: form.testType,
      status: form.status,
    } as TestSetCreateRequest;

    try {
      if (selectedId) {
        await testSetService.updateTestSet(selectedId, body);
        alert("Cập nhật thành công");
      } else {
        await testSetService.createTestSetWithMeanings(body);
        alert("Tạo bộ đề thành công");
      }
      setIsDialogOpen(false);
      setSelectedId(null);
    } catch (e) {
      console.error(e);
      alert("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <HeaderAdmin
        title="Quản lý Test Set"
        description="Quản lý các bộ đề thi"
      />

      <div className="p-8 mt-24">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quản lý Test Set</h2>
          <Button onClick={openCreate}>Thêm mới</Button>
        </div>

        <Card className="bg-white border mt-4">
          <CardHeader>
            <CardTitle className="text-base">Bộ lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm test set..."
                  defaultValue={filters.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={filters.levelN ? String(filters.levelN) : "ALL"}
                onValueChange={(v) =>
                  handleFilterByLevel(v === "ALL" ? undefined : Number(v))
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Cấp độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả cấp</SelectItem>
                  <SelectItem value="1">N1</SelectItem>
                  <SelectItem value="2">N2</SelectItem>
                  <SelectItem value="3">N3</SelectItem>
                  <SelectItem value="4">N4</SelectItem>
                  <SelectItem value="5">N5</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.testType || "ALL"}
                onValueChange={(v) =>
                  handleFilterByTestType(
                    v === "ALL"
                      ? undefined
                      : (v as TestSetCreateRequest["testType"])
                  )
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Loại đề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả loại</SelectItem>
                  <SelectItem value="VOCABULARY">VOCABULARY</SelectItem>
                  <SelectItem value="GRAMMAR">GRAMMAR</SelectItem>
                  <SelectItem value="KANJI">KANJI</SelectItem>
                  <SelectItem value="LISTENING">LISTENING</SelectItem>
                  <SelectItem value="READING">READING</SelectItem>
                  <SelectItem value="SPEAKING">SPEAKING</SelectItem>
                  <SelectItem value="GENERAL">GENERAL</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.status || "ALL"}
                onValueChange={(v) =>
                  handleFilterByStatus(
                    v === "ALL"
                      ? undefined
                      : (v as TestSetCreateRequest["status"])
                  )
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-white">
                  <CardHeader>
                    <Skeleton className="h-5 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : testSets.length === 0 ? (
            <div className="text-center text-gray-500 py-16">Không có test set</div>
          ) : (
          <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testSets.map((t) => (
                <Card
                  key={t.id}
                  className="hover:border-primary/40 transition-colors cursor-pointer"
                  onClick={() => openEdit(t.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{t.name}</CardTitle>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {t.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">N{t.levelN}</Badge>
                        <Badge
                          className={
                            t.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : t.status === "DRAFT"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {t.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-700 mb-3 line-clamp-3">
                      {t.content}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {t.price ? `${t.price.toLocaleString()} ₫` : "Miễn phí"}
                      </div>
                      <div>{t.testType}</div>
                      <div>#{t.id}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          <div className="flex justify-end mt-6">
            {pagination && (
              <PaginationControls
                currentPage={pagination.current || 1}
                totalPages={pagination.totalPage || 0}
                totalItems={pagination.totalItem || 0}
                itemsPerPage={pagination.pageSize || 10}
                onPageChange={(nextPage: number) => handlePageChange(nextPage)}
                onItemsPerPageChange={(size: number) => handlePageSizeChange(size)}
                isLoading={isLoading}
              />
            )}
          </div>
          </>
          )}
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(o) => {
            if (!o) {
              setIsDialogOpen(false);
              setSelectedId(null);
            }
          }}
        >
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>
                {selectedId ? "Chỉnh sửa Test Set" : "Tạo Test Set"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Name (vi)</label>
                  <Input
                    value={form.nameVi}
                    onChange={(e) =>
                      setForm({ ...form, nameVi: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Name (en)</label>
                  <Input
                    value={form.nameEn}
                    onChange={(e) =>
                      setForm({ ...form, nameEn: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Description (vi)
                  </label>
                  <Input
                    value={form.descriptionVi}
                    onChange={(e) =>
                      setForm({ ...form, descriptionVi: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Description (en)
                  </label>
                  <Input
                    value={form.descriptionEn}
                    onChange={(e) =>
                      setForm({ ...form, descriptionEn: e.target.value })
                    }
                  />
                </div>
              </div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <label className="text-sm font-medium">Audio URL</label>
              <Input
                value={form.audioUrl}
                onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">LevelN</label>
                  <Select
                    value={String(form.levelN)}
                    onValueChange={(v) =>
                      setForm({ ...form, levelN: Number(v) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cấp độ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">N1</SelectItem>
                      <SelectItem value="2">N2</SelectItem>
                      <SelectItem value="3">N3</SelectItem>
                      <SelectItem value="4">N4</SelectItem>
                      <SelectItem value="5">N5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Test Type</label>
                  <Select
                    value={form.testType}
                    onValueChange={(v) =>
                      setForm({
                        ...form,
                        testType: v as TestSetCreateRequest["testType"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VOCABULARY">VOCABULARY</SelectItem>
                      <SelectItem value="GRAMMAR">GRAMMAR</SelectItem>
                      <SelectItem value="KANJI">KANJI</SelectItem>
                      <SelectItem value="LISTENING">LISTENING</SelectItem>
                      <SelectItem value="READING">READING</SelectItem>
                      <SelectItem value="SPEAKING">SPEAKING</SelectItem>
                      <SelectItem value="GENERAL">GENERAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm({
                        ...form,
                        status: v as TestSetCreateRequest["status"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">DRAFT</SelectItem>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedId(null);
                  }}
                >
                  Hủy
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default TestSetManagement;
