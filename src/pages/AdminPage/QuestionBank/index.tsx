import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useQuestionBank } from "@hooks/useQuestionBank";
import { useDebounce } from "@hooks/useDebounce";
import { selectCurrentLanguage } from "@redux/features/language/selector";
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
  const { t } = useTranslation();
  const language = useSelector(selectCurrentLanguage);
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
  const debouncedSearchInput = useDebounce(searchInput, 500);

  // Update filters when debounced search changes
  useEffect(() => {
    handleFilterChange("search", debouncedSearchInput);
  }, [debouncedSearchInput, handleFilterChange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("questionBank.title")}
          </h1>
          <p className="text-gray-600">
            {t("questionBank.subtitle")}
          </p>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <Input
                  placeholder={t("questionBank.searchPlaceholder")}
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
                    <SelectValue placeholder={t("questionBank.allLevels")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("questionBank.allLevels")}</SelectItem>
                    {Object.entries(JLPT_LEVEL_LABELS[language as keyof typeof JLPT_LEVEL_LABELS] || {}).map(([key, label]) => (
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
                    <SelectValue placeholder={t("questionBank.allQuestionTypes")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("questionBank.allQuestionTypes")}</SelectItem>
                    {Object.entries(QUESTION_TYPE_LABELS[language as keyof typeof QUESTION_TYPE_LABELS] || {}).map(
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
                {t("questionBank.addQuestion")}
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
                  <TableHead>{t("questionBank.questionId")}</TableHead>
                  <TableHead>{t("questionBank.question")}</TableHead>
                  <TableHead>{t("questionBank.questionType")}</TableHead>
                  <TableHead>{t("questionBank.level")}</TableHead>
                  <TableHead>{t("questionBank.pronunciation")}</TableHead>
                  <TableHead>{t("questionBank.meaning")}</TableHead>
                  <TableHead>{t("questionBank.createdAt")}</TableHead>
                  <TableHead>{t("questionBank.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      {t("common.loading")}
                    </TableCell>
                  </TableRow>
                ) : questions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      {t("questionBank.noQuestions")}
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
                {isCreateDialogOpen ? t("questionBank.createDialog.title") : t("questionBank.createDialog.editTitle")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                label={t("questionBank.createDialog.questionJpLabel")}
                value={formData.questionJp}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    questionJp: e.target.value,
                  }))
                }
                placeholder={t("questionBank.createDialog.questionJpPlaceholder")}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("questionBank.createDialog.questionTypeLabel")}
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
                      <SelectValue placeholder={t("questionBank.createDialog.questionTypePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(QUESTION_TYPE_LABELS[language as keyof typeof QUESTION_TYPE_LABELS] || {}).map(
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
                    {t("questionBank.createDialog.levelLabel")}
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
                      <SelectValue placeholder={t("questionBank.createDialog.levelPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(JLPT_LEVEL_LABELS[language as keyof typeof JLPT_LEVEL_LABELS] || {}).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Input
                label={t("questionBank.createDialog.pronunciationLabel")}
                value={formData.pronunciation}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pronunciation: e.target.value,
                  }))
                }
                placeholder={t("questionBank.createDialog.pronunciationPlaceholder")}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("questionBank.createDialog.meaningLabel")}
                </label>
                <Textarea
                  value={formData.meaning}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meaning: e.target.value,
                    }))
                  }
                  placeholder={t("questionBank.createDialog.meaningPlaceholder")}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialogs}>
                {t("common.cancel")}
              </Button>
              <Button
                onClick={
                  isCreateDialogOpen ? handleCreateQuestion : handleEditQuestion
                }
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating
                  ? t("questionBank.createDialog.processing")
                  : isCreateDialogOpen
                    ? t("questionBank.createDialog.createButton")
                    : t("questionBank.createDialog.updateButton")}
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
              <DialogTitle>{t("questionBank.deleteDialog.title")}</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600 mb-6">
              {t("questionBank.deleteDialog.message")}
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteQuestionId(null)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                variant="destructive"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={handleDeleteQuestion}
                disabled={isDeleting}
              >
                {isDeleting ? t("questionBank.deleteDialog.deleting") : t("questionBank.deleteDialog.deleteButton")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QuestionBankManagement;
