import React, { useState, useEffect } from "react";
import { useQuestionBank } from "@hooks/useQuestionBank";
import {
  QUESTION_TYPE_LABELS,
  JLPT_LEVEL_LABELS,
  QuestionType,
  JLPTLevel,
} from "@constants/questionBank";
import { QuestionEntityType } from "@models/questionBank/entity";
import PaginationControls from "@ui/PaginationControls";
import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/Table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@ui/Dialog";
import { Card, CardContent } from "@ui/Card";
import { Badge } from "@ui/Badge";
import { Textarea } from "@ui/Textarea";

const QuestionBankManagement: React.FC = () => {
  const {
    questions,
    pagination,
    isLoading,
    filters,
    formData,
    isCreateDialogOpen,
    isEditDialogOpen,
    deleteQuestionId,
    isCreating,
    isUpdating,
    isDeleting,
    handleFilterChange,
    handlePageChange,
    handleCreateQuestion,
    handleEditQuestion,
    handleDeleteQuestion,
    openCreateDialog,
    openEditDialog,
    closeDialogs,
    setFormData,
    setDeleteQuestionId,
    getQuestionTypeLabel,
    getJLPTLevelLabel,
  } = useQuestionBank();

  // Local state for search input with debounce
  const [searchInput, setSearchInput] = useState(filters.search || "");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilterChange("search", searchInput);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchInput, handleFilterChange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý Ngân hàng Câu hỏi
          </h1>
          <p className="text-gray-600">
            Quản lý và tổ chức các câu hỏi cho bài học
          </p>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <Input
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full sm:w-64"
                  isSearch
                />
                <Select
                  value={filters.levelN?.toString() || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "levelN",
                      value === "all" ? undefined : parseInt(value)
                    )
                  }
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Tất cả cấp độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả cấp độ</SelectItem>
                    {Object.entries(JLPT_LEVEL_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.questionType || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "questionType",
                      value === "all" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Tất cả loại câu hỏi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại câu hỏi</SelectItem>
                    {Object.entries(QUESTION_TYPE_LABELS).map(
                      ([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={openCreateDialog} className="flex items-center">
                <span className="mr-2">+</span>
                Thêm câu hỏi
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Questions Table */}
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Câu hỏi</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Cấp độ</TableHead>
                  <TableHead>Phiên âm</TableHead>
                  <TableHead>Nghĩa</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : questions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Không có câu hỏi nào
                    </TableCell>
                  </TableRow>
                ) : (
                  questions.map((question: QuestionEntityType) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">
                        {question.id}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {question.questionJp}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getQuestionTypeLabel(question.questionType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getJLPTLevelLabel(question.levelN)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {question.pronunciation}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {question.meaning}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(question.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(question)}
                          >
                            ✏️
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteQuestionId(question.id)}
                          >
                            🗑️
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.totalPage > 1 && (
          <div className="mt-6">
            <PaginationControls
              currentPage={pagination.current}
              totalPages={pagination.totalPage}
              totalItems={pagination.totalItem}
              itemsPerPage={pagination.pageSize}
              onPageChange={handlePageChange}
              onItemsPerPageChange={(size) => handleFilterChange("limit", size)}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog
          open={isCreateDialogOpen || isEditDialogOpen}
          onOpenChange={closeDialogs}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>
                {isCreateDialogOpen ? "Thêm câu hỏi mới" : "Chỉnh sửa câu hỏi"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                label="Câu hỏi tiếng Nhật"
                value={formData.questionJp}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    questionJp: e.target.value,
                  }))
                }
                placeholder="Nhập câu hỏi tiếng Nhật"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại câu hỏi
                  </label>
                  <Select
                    value={formData.questionType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        questionType: value as QuestionType,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại câu hỏi" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(QUESTION_TYPE_LABELS).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cấp độ JLPT
                  </label>
                  <Select
                    value={formData.levelN.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        levelN: parseInt(value) as JLPTLevel,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cấp độ JLPT" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(JLPT_LEVEL_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Input
                label="Phiên âm"
                value={formData.pronunciation}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pronunciation: e.target.value,
                  }))
                }
                placeholder="Nhập phiên âm"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nghĩa
                </label>
                <Textarea
                  value={formData.meaning}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meaning: e.target.value,
                    }))
                  }
                  placeholder="Nhập nghĩa"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialogs}>
                Hủy
              </Button>
              <Button
                onClick={
                  isCreateDialogOpen ? handleCreateQuestion : handleEditQuestion
                }
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating
                  ? "Đang xử lý..."
                  : isCreateDialogOpen
                  ? "Tạo câu hỏi"
                  : "Cập nhật"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog
          open={!!deleteQuestionId}
          onOpenChange={() => setDeleteQuestionId(null)}
        >
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể
              hoàn tác.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteQuestionId(null)}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={handleDeleteQuestion}
                disabled={isDeleting}
              >
                {isDeleting ? "Đang xóa..." : "Xóa"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QuestionBankManagement;
