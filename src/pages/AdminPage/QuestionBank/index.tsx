import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useQuestionBank } from "@hooks/useQuestionBank";
import { useDebounce } from "@hooks/useDebounce";
import { selectCurrentLanguage } from "@redux/features/language/selector";
import { IQueryQuestionRequest } from "@models/questionBank/request";
import { QUESTION_TYPE_LABELS, JLPT_LEVEL_LABELS } from "@constants/questionBank";
import PaginationControls from "@ui/PaginationControls";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@ui/Card";
import HeaderAdmin from "@organisms/Header/Admin";
import StatsCards from "./components/StatsCards";
import FiltersBar from "./components/FiltersBar";
import QuestionsTable from "./components/QuestionsTable";
import CreateEditDialog from "./components/CreateEditDialog";
import DeleteDialog from "./components/DeleteDialog";

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
    isUpdatingAnswer,
    isLoadingAnswers,
    fieldErrors,
    setFieldErrors,
    handleFilterChange,
    handlePageChange,
    handleSort,
    handleCreateQuestion,
    handleDeleteQuestion,
    handleUpdateQuestion,
    handleUpdateAnswer,
    openCreateDialog,
    openEditDialog,
    closeDialogs,
    setFormData,
    setDeleteQuestionId,
    getQuestionTypeLabel,
  } = useQuestionBank();

  // Local state for search input with debounce
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearchInput = useDebounce(searchInput, 500);
  

  // Update filters when debounced search changes
  useEffect(() => {
    handleFilterChange("search", debouncedSearchInput);
  }, [debouncedSearchInput, handleFilterChange]);

  return (
    <>
      <HeaderAdmin
        title={t("questionBank.title")}
        description={t("questionBank.subtitle")}
      />
      <div className="p-8 mt-24">
        {/* Statistics Cards */}
        <StatsCards questions={questions} totalItems={pagination.totalItem} />

        {/* Questions List Card */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between mt-2">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Danh sách câu hỏi
              </CardTitle>
            </div>

            <FiltersBar
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              filters={filters}
              handleFilterChange={(key: string, value: unknown) =>
                    handleFilterChange(
                  key as keyof IQueryQuestionRequest,
                  value as string | number | undefined
                )
              }
              language={language}
              QUESTION_TYPE_LABELS={QUESTION_TYPE_LABELS}
              JLPT_LEVEL_LABELS={JLPT_LEVEL_LABELS}
              openCreateDialog={openCreateDialog}
              t={t}
            />
          </CardHeader>
          <CardContent>
            <QuestionsTable
              isLoading={isLoading}
              questions={questions}
              filters={filters}
              handleSort={handleSort}
              getQuestionTypeLabel={getQuestionTypeLabel}
              openEditDialog={openEditDialog}
              setDeleteQuestionId={setDeleteQuestionId}
              t={t}
            />
          </CardContent>

          <CardFooter>
            <PaginationControls
              currentPage={pagination.current}
              totalPages={pagination.totalPage}
              totalItems={pagination.totalItem}
              itemsPerPage={pagination.pageSize}
              onPageChange={handlePageChange}
              onItemsPerPageChange={(size) => handleFilterChange("limit", size)}
              isLoading={isLoading}
            />
          </CardFooter>
        </Card>

        {/* Create/Edit Dialog */}
        <CreateEditDialog
          isCreateDialogOpen={isCreateDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          closeDialogs={closeDialogs}
          t={t}
          formData={formData}
          setFormData={setFormData}
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
          isCreating={isCreating}
          isUpdating={isUpdating}
          isUpdatingAnswer={isUpdatingAnswer}
          isLoadingAnswers={isLoadingAnswers}
          handleCreateQuestion={handleCreateQuestion}
          handleUpdateQuestion={handleUpdateQuestion}
          handleUpdateAnswer={handleUpdateAnswer}
          QUESTION_TYPE_LABELS={QUESTION_TYPE_LABELS}
          JLPT_LEVEL_LABELS={JLPT_LEVEL_LABELS}
          language={language}
        />

        {/* Delete Confirmation */}
        <DeleteDialog
          open={!!deleteQuestionId}
          onClose={() => setDeleteQuestionId(null)}
          onConfirm={handleDeleteQuestion}
          isDeleting={isDeleting}
          t={t}
        />
      </div>
    </>
  );
};

export default QuestionBankManagement;
