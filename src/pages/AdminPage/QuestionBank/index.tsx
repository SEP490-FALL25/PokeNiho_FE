import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useQuestionBank } from "@hooks/useQuestionBank";
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
  TableHeader,
  TableRow,
} from "@ui/Table";
import SortableTableHeader from "@ui/SortableTableHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@ui/Dialog";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@ui/Card";
import { Badge } from "@ui/Badge";
import HeaderAdmin from "@organisms/Header/Admin";
import { BookOpen, Edit, Trash2 } from "lucide-react";

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
    isLoadingAnswers,
    handleFilterChange,
    handlePageChange,
    handleSort,
    handleCreateQuestion,
    handleEditQuestion,
    handleDeleteQuestion,
    openCreateDialog,
    openEditDialog,
    closeDialogs,
    setFormData,
    setDeleteQuestionId,
    getQuestionTypeLabel,
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
    <>
      <HeaderAdmin
        title={t("questionBank.title")}
        description={t("questionBank.subtitle")}
      />
      <div className="p-8 mt-24">
        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Tổng câu hỏi
              </CardTitle>
              <BookOpen className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {pagination.totalItem || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Câu hỏi N5
              </CardTitle>
              <Badge className="bg-green-200 text-green-800">N5</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {questions.filter((q) => q.levelN === 5).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Câu hỏi N4
              </CardTitle>
              <Badge className="bg-blue-200 text-blue-800">N4</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {questions.filter((q) => q.levelN === 4).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Câu hỏi N3
              </CardTitle>
              <Badge className="bg-yellow-200 text-yellow-800">N3</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {questions.filter((q) => q.levelN === 3).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Câu hỏi N2
              </CardTitle>
              <Badge className="bg-orange-200 text-orange-800">N2</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {questions.filter((q) => q.levelN === 2).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions List Card */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between mt-2">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Danh sách câu hỏi
              </CardTitle>
            </div>

            <div className="flex items-center justify-between">
              <div className="mt-4 pb-4 flex-1 mr-4 focus:ring-primary focus:ring-2">
                <Input
                  placeholder={t("questionBank.searchPlaceholder")}
                  value={searchInput}
                  isSearch
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Select
                  value={filters.levelN?.toString() || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "levelN",
                      value === "all" ? undefined : parseInt(value)
                    )
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={t("questionBank.allLevels")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("questionBank.allLevels")}
                    </SelectItem>
                    {Object.entries(
                      JLPT_LEVEL_LABELS[
                        language as keyof typeof JLPT_LEVEL_LABELS
                      ] || {}
                    ).map(([key, label]) => (
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
                  <SelectTrigger className="w-40">
                    <SelectValue
                      placeholder={t("questionBank.allQuestionTypes")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("questionBank.allQuestionTypes")}
                    </SelectItem>
                    {Object.entries(
                      QUESTION_TYPE_LABELS[
                        language as keyof typeof QUESTION_TYPE_LABELS
                      ] || {}
                    ).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={openCreateDialog}
                  className="bg-primary text-white hover:bg-primary/90 rounded-full shadow-md transition-transform transform hover:scale-105"
                >
                  <span className="mr-2">+</span>
                  {t("questionBank.addQuestion")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50">
                    <SortableTableHeader
                      title={t("questionBank.questionId")}
                      sortKey="id"
                      currentSortBy={filters.sortBy}
                      currentSort={filters.sortOrder as "asc" | "desc"}
                      onSort={handleSort}
                      className="text-gray-600 font-semibold w-12"
                    />
                    <SortableTableHeader
                      title={t("questionBank.question")}
                      sortKey="questionJp"
                      currentSortBy={filters.sortBy}
                      currentSort={filters.sortOrder as "asc" | "desc"}
                      onSort={handleSort}
                      className="text-gray-600 font-semibold w-64"
                    />
                    <SortableTableHeader
                      title={t("questionBank.questionType")}
                      sortKey="questionType"
                      currentSortBy={filters.sortBy}
                      currentSort={filters.sortOrder as "asc" | "desc"}
                      onSort={handleSort}
                      className="text-gray-600 font-semibold w-20"
                    />
                    <SortableTableHeader
                      title={t("questionBank.level")}
                      sortKey="levelN"
                      currentSortBy={filters.sortBy}
                      currentSort={filters.sortOrder as "asc" | "desc"}
                      onSort={handleSort}
                      className="text-gray-600 font-semibold w-16"
                    />
                    <SortableTableHeader
                      title={t("questionBank.meaning")}
                      sortKey="meaning"
                      currentSortBy={filters.sortBy}
                      currentSort={filters.sortOrder as "asc" | "desc"}
                      onSort={handleSort}
                      className="text-gray-600 font-semibold w-32"
                    />
                    <SortableTableHeader
                      title={t("questionBank.actions")}
                      sortable={false}
                      className="text-right w-20"
                    />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        {t("common.loading")}
                      </TableCell>
                    </TableRow>
                  ) : questions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        {t("questionBank.noQuestions")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    questions.map((question: QuestionEntityType) => (
                      <TableRow
                        key={question.id}
                        className="border-gray-200 hover:bg-gray-50 h-12"
                      >
                        <TableCell className="font-medium w-12 whitespace-nowrap text-sm py-2">
                          {question.id}
                        </TableCell>
                        <TableCell className="truncate py-2 w-64">
                          <div className="max-w-60">
                            <div className="font-medium text-sm truncate leading-tight">
                              {question.questionJp}
                            </div>
                            <div className="text-xs text-gray-500 truncate leading-tight">
                              {question.pronunciation || "No pronunciation"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="w-20 whitespace-nowrap py-2">
                          <Badge variant="secondary" className="text-xs">
                            {getQuestionTypeLabel(question.questionType)}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-16 whitespace-nowrap py-2">
                          <Badge variant="outline" className="text-xs">
                            N{question.levelN}
                          </Badge>
                        </TableCell>

                        <TableCell className="w-32 py-2">
                          {question.meaning ? (
                            <div className="text-gray-500 text-xs">
                              {question.meaning}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              No translation
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right w-20 py-2">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditDialog(question)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:bg-red-100"
                              onClick={() => setDeleteQuestionId(question.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
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
        <Dialog
          open={isCreateDialogOpen || isEditDialogOpen}
          onOpenChange={closeDialogs}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>
                {isCreateDialogOpen
                  ? t("questionBank.createDialog.title")
                  : t("questionBank.createDialog.editTitle")}
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
                placeholder={t(
                  "questionBank.createDialog.questionJpPlaceholder"
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("questionBank.createDialog.questionTypeLabel")}
                  </label>
                  <Select
                    value={formData.questionType}
                    onValueChange={(value) => {
                      const newQuestionType = value as QuestionType;
                      setFormData((prev) => {
                        const newFormData = {
                          ...prev,
                          questionType: newQuestionType,
                        };

                        // Clear fields that are not needed for the new question type
                        if (
                          newQuestionType !== "SPEAKING" &&
                          newQuestionType !== "VOCABULARY"
                        ) {
                          newFormData.pronunciation = "";
                        }
                        if (
                          newQuestionType !== "LISTENING" &&
                          newQuestionType !== "VOCABULARY"
                        ) {
                          newFormData.audioUrl = "";
                        }
                        if (!["GRAMMAR", "KANJI"].includes(newQuestionType)) {
                          newFormData.answers = [];
                        }

                        return newFormData;
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "questionBank.createDialog.questionTypePlaceholder"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(
                        QUESTION_TYPE_LABELS[
                          language as keyof typeof QUESTION_TYPE_LABELS
                        ] || {}
                      ).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
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
                      <SelectValue
                        placeholder={t(
                          "questionBank.createDialog.levelPlaceholder"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(
                        JLPT_LEVEL_LABELS[
                          language as keyof typeof JLPT_LEVEL_LABELS
                        ] || {}
                      ).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Pronunciation - Show for VOCABULARY and SPEAKING */}
              {(formData.questionType === "VOCABULARY" ||
                formData.questionType === "SPEAKING") && (
                <Input
                  label={`${t("questionBank.createDialog.pronunciationLabel")}${
                    formData.questionType === "SPEAKING" ? " *" : ""
                  }`}
                  value={formData.pronunciation || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pronunciation: e.target.value,
                    }))
                  }
                  placeholder={t(
                    "questionBank.createDialog.pronunciationPlaceholder"
                  )}
                  required={formData.questionType === "SPEAKING"}
                />
              )}

              {/* Audio URL - Show for VOCABULARY and LISTENING */}
              {(formData.questionType === "VOCABULARY" ||
                formData.questionType === "LISTENING") && (
                <div className="space-y-2">
                  <Input
                    label={t("questionBank.createDialog.audioUrlLabel")}
                    value={formData.audioUrl || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        audioUrl: e.target.value,
                      }))
                    }
                    placeholder={
                      formData.questionType === "LISTENING"
                        ? "Optional - will auto-generate TTS if not provided"
                        : "Optional"
                    }
                  />
                  {formData.questionType === "VOCABULARY" &&
                    formData.audioUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            audioUrl: "",
                          }))
                        }
                        className="w-full"
                      >
                        Remove Audio URL
                      </Button>
                    )}
                </div>
              )}
              {/* Meanings/Translations - Show for all question types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("questionBank.createDialog.meaningsLabel")}
                </label>
                {formData.meanings?.map((meaning, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 mb-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Vietnamese Translation
                        </label>
                        <Input
                          value={meaning.translations.vi}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              meanings: (prev.meanings || []).map((m, i) =>
                                i === index
                                  ? {
                                      ...m,
                                      translations: {
                                        ...m.translations,
                                        vi: e.target.value,
                                      },
                                    }
                                  : m
                              ),
                            }))
                          }
                          placeholder="Vietnamese translation"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          English Translation
                        </label>
                        <Input
                          value={meaning.translations.en}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              meanings: (prev.meanings || []).map((m, i) =>
                                i === index
                                  ? {
                                      ...m,
                                      translations: {
                                        ...m.translations,
                                        en: e.target.value,
                                      },
                                    }
                                  : m
                              ),
                            }))
                          }
                          placeholder="English translation"
                        />
                      </div>
                    </div>
                    {(formData.meanings || []).length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            meanings: (prev.meanings || []).filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                      >
                        Remove Translation
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      meanings: [
                        ...(prev.meanings || []),
                        {
                          translations: {
                            vi: "",
                            en: "",
                            ja: "",
                          },
                        },
                      ],
                    }))
                  }
                >
                  Add Translation
                </Button>
              </div>

              {/* Answers - Show for all question types except MATCHING */}
              {formData.questionType !== "MATCHING" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("questionBank.createDialog.answersLabel")}
                  </label>
                  {isLoadingAnswers ? (
                    <div className="text-center py-4 text-gray-500">
                      {t("common.loading")}...
                    </div>
                  ) : (
                    formData.answers?.map((answer, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 mb-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={answer.isCorrect}
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                answers: prev.answers?.map((a, i) => ({
                                  ...a,
                                  isCorrect: i === index,
                                })),
                              }))
                            }
                            className="text-primary focus:ring-primary"
                          />
                          <label className="text-sm font-medium text-gray-700">
                            {answer.isCorrect
                              ? "Correct Answer"
                              : "Incorrect Answer"}
                          </label>
                        </div>
                        {formData.answers && formData.answers.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                answers: prev.answers?.filter(
                                  (_, i) => i !== index
                                ),
                              }))
                            }
                          >
                            Remove Answer
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Input
                          label="Japanese Answer"
                          value={answer.answerJp}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              answers: prev.answers?.map((a, i) =>
                                i === index
                                  ? { ...a, answerJp: e.target.value }
                                  : a
                              ),
                            }))
                          }
                          placeholder="Enter Japanese answer"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Vietnamese Translation
                            </label>
                            <Input
                              value={
                                answer.translations?.meaning?.find(
                                  (m) => m.language_code === "vi"
                                )?.value || ""
                              }
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  answers: prev.answers?.map((a, i) =>
                                    i === index
                                      ? {
                                          ...a,
                                          translations: {
                                            meaning: (a.translations?.meaning || []).map(
                                              (m) =>
                                                m.language_code === "vi"
                                                  ? {
                                                      ...m,
                                                      value: e.target.value,
                                                    }
                                                  : m
                                            ),
                                          },
                                        }
                                      : a
                                  ),
                                }))
                              }
                              placeholder="Vietnamese translation"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              English Translation
                            </label>
                            <Input
                              value={
                                answer.translations?.meaning?.find(
                                  (m) => m.language_code === "en"
                                )?.value || ""
                              }
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  answers: prev.answers?.map((a, i) =>
                                    i === index
                                      ? {
                                          ...a,
                                          translations: {
                                            meaning: (a.translations?.meaning || []).map(
                                              (m) =>
                                                m.language_code === "en"
                                                  ? {
                                                      ...m,
                                                      value: e.target.value,
                                                    }
                                                  : m
                                            ),
                                          },
                                        }
                                      : a
                                  ),
                                }))
                              }
                              placeholder="English translation"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                  )}
                  {formData.answers && formData.answers.length < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          answers: [
                            ...(prev.answers || []),
                            {
                              answerJp: "",
                              isCorrect: false,
                              translations: {
                                meaning: [
                                  {
                                    language_code: "vi",
                                    value: "",
                                  },
                                  {
                                    language_code: "en",
                                    value: "",
                                  },
                                ],
                              },
                            },
                          ],
                        }))
                      }
                    >
                      Add Answer
                    </Button>
                  )}
                </div>
              )}

              {/* MATCHING type - only one answer allowed */}
              {formData.questionType === "MATCHING" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("questionBank.createDialog.answerLabel")} (Required for
                    MATCHING)
                  </label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="space-y-3">
                      <Input
                        label="Japanese Answer"
                        value={formData.answers?.[0]?.answerJp || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            answers: [
                              {
                                answerJp: e.target.value,
                                isCorrect: true,
                                translations: {
                                  meaning: [
                                    {
                                      language_code: "vi",
                                      value:
                                        prev.answers?.[0]?.translations
                                          .meaning[0]?.value || "",
                                    },
                                  ],
                                },
                              },
                            ],
                          }))
                        }
                        placeholder="Enter Japanese answer"
                        required
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Vietnamese Translation
                          </label>
                          <Input
                            value={
                              formData.answers?.[0]?.translations?.meaning?.find(
                                (m) => m.language_code === "vi"
                              )?.value || ""
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                answers: [
                                  {
                                    answerJp: prev.answers?.[0]?.answerJp || "",
                                    isCorrect: true,
                                    translations: {
                                      meaning: (
                                        prev.answers?.[0]?.translations
                                          ?.meaning || []
                                      ).map((m) =>
                                        m.language_code === "vi"
                                          ? { ...m, value: e.target.value }
                                          : m
                                      ),
                                    },
                                  },
                                ],
                              }))
                            }
                            placeholder="Vietnamese translation"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            English Translation
                          </label>
                          <Input
                            value={
                              formData.answers?.[0]?.translations?.meaning?.find(
                                (m) => m.language_code === "en"
                              )?.value || ""
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                answers: [
                                  {
                                    answerJp: prev.answers?.[0]?.answerJp || "",
                                    isCorrect: true,
                                    translations: {
                                      meaning: (
                                        prev.answers?.[0]?.translations
                                          ?.meaning || []
                                      ).map((m) =>
                                        m.language_code === "en"
                                          ? { ...m, value: e.target.value }
                                          : m
                                      ),
                                    },
                                  },
                                ],
                              }))
                            }
                            placeholder="English translation"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                {isDeleting
                  ? t("questionBank.deleteDialog.deleting")
                  : t("questionBank.deleteDialog.deleteButton")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default QuestionBankManagement;
