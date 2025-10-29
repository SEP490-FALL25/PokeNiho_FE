import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import questionBankService from "@services/questionBank";
import {
  IQueryQuestionRequest,
  ICreateQuestionRequest,
} from "@models/questionBank/request";
import { QuestionEntityType } from "@models/questionBank/entity";
import {
  QUESTION_TYPE,
  JLPT_LEVEL,
  QUESTION_TYPE_LABELS,
  JLPT_LEVEL_LABELS,
  QuestionType,
  JLPTLevel,
} from "@constants/questionBank";
import { selectCurrentLanguage } from "@redux/features/language/selector";
import { useSelector } from "react-redux";
import answerService from "@services/answer";
import { IQueryAnswerRequest } from "@models/answer/request";
import { useUpdateAnswer, useCreateAnswer } from "@hooks/useAnswer";

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string | string[];
    };
  };
}

/**
 * Hook for managing QuestionBank list with filters and pagination
 * @param filters IQueryQuestionRequest
 * @returns { data, isLoading, error, pagination }
 */
export const useQuestionBankList = (filters: IQueryQuestionRequest) => {
  const language = useSelector(selectCurrentLanguage);

  const { data, isLoading, error } = useQuery({
    queryKey: ["question-bank-list", filters, language],
    queryFn: () => questionBankService.getQuestionList(filters),
  });
  return {
    data: data?.data?.data?.results || [],
    pagination: data?.data?.data?.pagination || {
      current: 1,
      pageSize: 15,
      totalPage: 1,
      totalItem: 0,
    },
    isLoading,
    error,
  };
};

/**
 * Hook for creating a new question
 * @returns mutation object with createQuestion function
 */
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  const createQuestionMutation = useMutation({
    mutationFn: (data: ICreateQuestionRequest) =>
      questionBankService.createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question-bank-list"] });
      toast.success("Tạo câu hỏi thành công!");
    },
    onError: (error: unknown) => {
      console.error("Error creating question:", error);
      const apiError = error as ApiError;
      if (apiError?.response?.status === 422) {
        const messages = apiError?.response?.data?.message;
        if (Array.isArray(messages)) {
          toast.error(`Lỗi validation: ${messages.join(", ")}`);
        } else {
          toast.error(messages || "Lỗi validation");
        }
      } else {
        toast.error(
          apiError?.response?.data?.message || "Có lỗi xảy ra khi tạo câu hỏi"
        );
      }
    },
  });

  return createQuestionMutation;
};

/**
 * Hook for updating a question
 * @returns mutation object with updateQuestion function
 */
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  const updateQuestionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ICreateQuestionRequest }) =>
      questionBankService.updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question-bank-list"] });
      toast.success("Cập nhật câu hỏi thành công!");
    },
    onError: (error: unknown) => {
      console.error("Error updating question:", error);
      const apiError = error as ApiError;
      if (apiError?.response?.status === 422) {
        const messages = apiError?.response?.data?.message;
        if (Array.isArray(messages)) {
          toast.error(`Lỗi validation: ${messages.join(", ")}`);
        } else {
          toast.error(messages || "Lỗi validation");
        }
      } else {
        toast.error(
          apiError?.response?.data?.message ||
            "Có lỗi xảy ra khi cập nhật câu hỏi"
        );
      }
    },
  });

  return updateQuestionMutation;
};

/**
 * Hook for deleting a question
 * @returns mutation object with deleteQuestion function
 */
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: number) => questionBankService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question-bank-list"] });
      toast.success("Xóa câu hỏi thành công!");
    },
    onError: (error: unknown) => {
      console.error("Error deleting question:", error);
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message || "Có lỗi xảy ra khi xóa câu hỏi"
      );
    },
  });

  return deleteQuestionMutation;
};

/**
 * Main hook for QuestionBank management with all CRUD operations and state management
 * @param initialFilters IQueryQuestionRequest
 * @returns Complete QuestionBank management interface
 */
export const useQuestionBank = (
  initialFilters: IQueryQuestionRequest = {
    page: 1,
    limit: 15,
    search: "",
    levelN: undefined,
    questionType: undefined,
    status: undefined,
    sortBy: undefined,
    sortOrder: undefined,
    noTestSet: false,
    testSetId: undefined,
  }
) => {
  // State management
  const [filters, setFilters] = useState<IQueryQuestionRequest>(initialFilters);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<QuestionEntityType | null>(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<ICreateQuestionRequest>({
    questionJp: "",
    questionType: QUESTION_TYPE.VOCABULARY,
    levelN: JLPT_LEVEL.N5,
    pronunciation: "",
    audioUrl: "",
    meanings: [
      {
        translations: {
          vi: "",
          en: "",
        },
      },
    ],
    answers: [
      {
        id: undefined,
        answerJp: "",
        isCorrect: true,
        translations: {
          meaning: [
            { language_code: "vi", value: "" },
            { language_code: "en", value: "" },
          ],
        },
      },
      {
        id: undefined,
        answerJp: "",
        isCorrect: false,
        translations: {
          meaning: [
            { language_code: "vi", value: "" },
            { language_code: "en", value: "" },
          ],
        },
      },
      {
        id: undefined,
        answerJp: "",
        isCorrect: false,
        translations: {
          meaning: [
            { language_code: "vi", value: "" },
            { language_code: "en", value: "" },
          ],
        },
      },
      {
        id: undefined,
        answerJp: "",
        isCorrect: false,
        translations: {
          meaning: [
            { language_code: "vi", value: "" },
            { language_code: "en", value: "" },
          ],
        },
      },
    ],
  });

  // API hooks
  const {
    data: questions,
    pagination,
    isLoading,
    error,
  } = useQuestionBankList(filters);
  const createQuestionMutation = useCreateQuestion();
  const updateQuestionMutation = useUpdateQuestion();
  const deleteQuestionMutation = useDeleteQuestion();

  // Answer-specific hooks
  const updateAnswerMutation = useUpdateAnswer();
  const createAnswerMutation = useCreateAnswer();

  // Filter handlers
  const handleFilterChange = useCallback(
    (key: keyof IQueryQuestionRequest, value: string | number | undefined) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: 1, // Reset to first page when filters change
      }));
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  // Sort handler
  const handleSort = useCallback((sortKey: string) => {
    setFilters((prev) => {
      const currentSortBy = prev.sortBy;
      const currentSortOrder = prev.sortOrder;

      // If clicking the same column, toggle sort order
      if (currentSortBy === sortKey) {
        const newSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
        return {
          ...prev,
          sortBy: sortKey,
          sortOrder: newSortOrder,
          page: 1, // Reset to first page when sorting
        };
      }

      // If clicking a different column, set to ascending
      return {
        ...prev,
        sortBy: sortKey,
        sortOrder: "asc",
        page: 1, // Reset to first page when sorting
      };
    });
  }, []);

  // Validation function
  const validateFormData = useCallback((data: ICreateQuestionRequest) => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Validate questionJp (required for all types)
    if (!data.questionJp || data.questionJp.trim() === "") {
      const error = "Câu hỏi tiếng Nhật là bắt buộc";
      errors.push(error);
      fieldErrors.questionJp = [error];
    }

    // Validate meanings (required for all types)
    if (!data.meanings || data.meanings.length === 0) {
      const error = "Bản dịch là bắt buộc";
      errors.push(error);
      fieldErrors.meanings = [error];
    } else {
      const hasValidMeaning = data.meanings.some(
        (meaning) =>
          meaning.translations.vi?.trim() !== "" ||
          meaning.translations.en?.trim() !== ""
      );
      if (!hasValidMeaning) {
        const error =
          "Ít nhất một bản dịch (tiếng Việt hoặc tiếng Anh) phải được điền";
        errors.push(error);
        fieldErrors.meanings = [error];
      }
    }

    // Validate answers (required for all types except MATCHING)
    if (data.questionType !== "MATCHING") {
      if (!data.answers || data.answers.length === 0) {
        const error = "Ít nhất một câu trả lời là bắt buộc";
        errors.push(error);
        fieldErrors.answers = [error];
      } else {
        // Check if at least one answer is marked as correct
        const hasCorrectAnswer = data.answers.some(
          (answer) => answer.isCorrect
        );
        if (!hasCorrectAnswer) {
          const error = "Ít nhất một câu trả lời phải được đánh dấu là đúng";
          errors.push(error);
          fieldErrors.answers = [...(fieldErrors.answers || []), error];
        }

        // Check if all answers have Japanese text
        const hasEmptyAnswers = data.answers.some(
          (answer) => !answer.answerJp || answer.answerJp.trim() === ""
        );
        if (hasEmptyAnswers) {
          const error = "Tất cả câu trả lời phải có nội dung tiếng Nhật";
          errors.push(error);
          fieldErrors.answers = [...(fieldErrors.answers || []), error];
        }
      }
    } else {
      // For MATCHING type, validate single answer
      if (
        !data.answers ||
        data.answers.length === 0 ||
        !data.answers[0]?.answerJp ||
        data.answers[0].answerJp.trim() === ""
      ) {
        const error = "Câu trả lời tiếng Nhật là bắt buộc cho loại MATCHING";
        errors.push(error);
        fieldErrors.answers = [error];
      }
    }

    // Validate pronunciation for SPEAKING type
    if (
      data.questionType === "SPEAKING" &&
      (!data.pronunciation || data.pronunciation.trim() === "")
    ) {
      const error = "Phát âm là bắt buộc cho loại SPEAKING";
      errors.push(error);
      fieldErrors.pronunciation = [error];
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
    };
  }, []);

  // Reset form data
  const resetFormData = useCallback(() => {
    setFormData({
      questionJp: "",
      questionType: QUESTION_TYPE.VOCABULARY,
      levelN: JLPT_LEVEL.N5,
      pronunciation: "",
      audioUrl: "",
      meanings: [
        {
          translations: {
            vi: "",
            en: "",
          },
        },
      ],
      answers: [
        {
          id: undefined,
          answerJp: "",
          isCorrect: true,
          translations: {
            meaning: [
              { language_code: "vi", value: "" },
              { language_code: "en", value: "" },
            ],
          },
        },
        {
          id: undefined,
          answerJp: "",
          isCorrect: false,
          translations: {
            meaning: [
              { language_code: "vi", value: "" },
              { language_code: "en", value: "" },
            ],
          },
        },
        {
          id: undefined,
          answerJp: "",
          isCorrect: false,
          translations: {
            meaning: [
              { language_code: "vi", value: "" },
              { language_code: "en", value: "" },
            ],
          },
        },
        {
          id: undefined,
          answerJp: "",
          isCorrect: false,
          translations: {
            meaning: [
              { language_code: "vi", value: "" },
              { language_code: "en", value: "" },
            ],
          },
        },
      ],
    });
  }, []);

  // CRUD operations
  const handleCreateQuestion = useCallback(async () => {
    // Validate form data before submitting
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setFieldErrors(validation.fieldErrors);
      toast.error(`Lỗi validation: ${validation.errors.join(", ")}`);
      return;
    }

    // Clear validation errors if validation passes
    setValidationErrors([]);
    setFieldErrors({});

    // Clean up form data before sending
    const cleanedFormData = {
      ...formData,
      meanings: formData.meanings, // Already array format
      audioUrl: formData.audioUrl === "" ? null : formData.audioUrl,
      // Remove options for VOCABULARY type
      ...(formData.questionType === "VOCABULARY" && { options: undefined }),
      // Remove correctAnswer for all types
      correctAnswer: undefined,
    };

    // Log the payload for debugging
    console.log(
      "Creating question with payload:",
      JSON.stringify(cleanedFormData, null, 2)
    );

    createQuestionMutation.mutate(cleanedFormData as ICreateQuestionRequest, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        resetFormData();
      },
    });
  }, [formData, createQuestionMutation, resetFormData, validateFormData]);

  const handleEditQuestion = useCallback(async () => {
    if (!editingQuestion) return;

    // Validate form data before submitting
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setFieldErrors(validation.fieldErrors);
      toast.error(`Lỗi validation: ${validation.errors.join(", ")}`);
      return;
    }

    // Clear validation errors if validation passes
    setValidationErrors([]);
    setFieldErrors({});

    // Clean up form data before sending
    const cleanedFormData = {
      ...formData,
      audioUrl: formData.audioUrl === "" ? null : formData.audioUrl,
      // Remove options for VOCABULARY type
      ...(formData.questionType === "VOCABULARY" && { options: undefined }),
      // Remove correctAnswer for all types
      correctAnswer: undefined,
    };

    updateQuestionMutation.mutate(
      {
        id: editingQuestion.id,
        data: cleanedFormData,
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setEditingQuestion(null);
        },
      }
    );
  }, [editingQuestion, formData, updateQuestionMutation, validateFormData]);

  const handleDeleteQuestion = useCallback(async () => {
    if (!deleteQuestionId) return;

    deleteQuestionMutation.mutate(deleteQuestionId, {
      onSuccess: () => {
        setDeleteQuestionId(null);
      },
    });
  }, [deleteQuestionId, deleteQuestionMutation]);

  // State for loading answers
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Dialog handlers
  const openCreateDialog = useCallback(() => {
    resetFormData();
    setValidationErrors([]);
    setFieldErrors({});
    setIsCreateDialogOpen(true);
  }, [resetFormData]);

  const openEditDialog = useCallback(async (question: QuestionEntityType) => {
    setEditingQuestion(question);
    setValidationErrors([]);
    setFieldErrors({});
    setIsEditDialogOpen(true);

    // Set basic question data immediately
    setFormData({
      questionJp: question.questionJp,
      questionType: question.questionType as QuestionType,
      levelN: question.levelN as JLPTLevel,
      pronunciation: question.pronunciation || "",
      audioUrl: question.audioUrl || "",
      meanings: Array.isArray(question.meanings)
        ? (() => {
            // Find Vietnamese and English translations from API data
            let viTranslation = "";
            let enTranslation = "";

            question.meanings.forEach((meaning) => {
              if ("language" in meaning && "value" in meaning) {
                // New API format (language/value)
                if (meaning.language === "vi") {
                  viTranslation = meaning.value;
                } else if (meaning.language === "en") {
                  enTranslation = meaning.value;
                }
              } else if ("translations" in meaning) {
                // Old format (translations.vi/en)
                viTranslation = meaning.translations.vi || "";
                enTranslation = meaning.translations.en || "";
              }
            });

            return [
              {
                translations: {
                  vi: viTranslation,
                  en: enTranslation,
                },
              },
            ];
          })()
        : [
            {
              translations: {
                vi: question.meaning || "",
                en: "",
              },
            },
          ],
      answers: [], // Will be populated after fetching
    });

    // Fetch answers for this question
    setIsLoadingAnswers(true);
    try {
      const filters: IQueryAnswerRequest = {
        questionBankId: question.id,
        limit: 10,
      };
      const response = await answerService.getAnswerList(filters);
      const fetchedAnswers = response.data.data.results || [];
      // Transform the fetched answers to match the form structure
      const formattedAnswers = fetchedAnswers.map(
        (answer: {
          id: number;
          answerJp: string;
          isCorrect: boolean;
          meanings?: Array<{ language: string; value: string }>;
          translations?: {
            meaning: Array<{ language_code: string; value: string }>;
          };
        }) => {
          // Handle both API response formats
          let translations: Array<{ language_code: string; value: string }> =
            [];
          if (answer.meanings && Array.isArray(answer.meanings)) {
            // New format: answer.meanings with {language, value}
            translations = answer.meanings.map(
              (m: { language: string; value: string }) => ({
                language_code: m.language,
                value: m.value,
              })
            );
          } else if (
            answer.translations?.meaning &&
            Array.isArray(answer.translations.meaning)
          ) {
            // Old format: answer.translations.meaning with {language_code, value}
            translations = answer.translations.meaning;
          }

          return {
            id: answer.id, // Store the answer ID for updates
            answerJp: answer.answerJp,
            isCorrect: answer.isCorrect,
            translations: {
              meaning: translations,
            },
          };
        }
      );

      // Update form data with fetched answers
      setFormData((prev) => {
        const base = formattedAnswers.length > 0 ? formattedAnswers : [
          {
            id: undefined,
            answerJp: "",
            isCorrect: true,
            translations: {
              meaning: [
                { language_code: "vi", value: "" },
                { language_code: "en", value: "" },
              ],
            },
          },
        ];

        // For non-MATCHING, ensure exactly 4 answer slots by padding blanks
        if (question.questionType !== "MATCHING") {
          const padded = [...base];
          while (padded.length < 4) {
            padded.push({
              id: undefined,
              answerJp: "",
              isCorrect: false,
              translations: {
                meaning: [
                  { language_code: "vi", value: "" },
                  { language_code: "en", value: "" },
                ],
              },
            });
          }
          return { ...prev, answers: padded.slice(0, 4) };
        }

        return { ...prev, answers: base.slice(0, 1) };
      });
    } catch (error) {
      console.error("Error fetching answers:", error);
      toast.error("Không thể tải danh sách câu trả lời");
      // If fetching fails, use empty answers
      setFormData((prev) => ({
        ...prev,
        answers: [
          {
            id: undefined,
            answerJp: "",
            isCorrect: true,
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
      }));
    } finally {
      setIsLoadingAnswers(false);
    }
  }, []);

  const closeDialogs = useCallback(() => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingQuestion(null);
    setValidationErrors([]);
    setFieldErrors({});
  }, []);

  // Get current language
  const language = useSelector(selectCurrentLanguage);

  // Utility functions
  const getQuestionTypeLabel = useCallback(
    (type: string) => {
      const labels =
        QUESTION_TYPE_LABELS[language as keyof typeof QUESTION_TYPE_LABELS];
      return labels?.[type as keyof typeof labels] || type;
    },
    [language]
  );

  const getJLPTLevelLabel = useCallback(
    (level: number) => {
      const labels =
        JLPT_LEVEL_LABELS[language as keyof typeof JLPT_LEVEL_LABELS];
      return labels?.[level as keyof typeof labels] || `N${level}`;
    },
    [language]
  );

  // Handler for updating only question part
  const handleUpdateQuestion = useCallback(async () => {
    if (!editingQuestion) return;

    const questionData = {
      questionJp: formData.questionJp,
      questionType: formData.questionType,
      levelN: formData.levelN,
      pronunciation: formData.pronunciation,
      audioUrl: formData.audioUrl,
      meanings: formData.meanings, // Already array format
    };

    await updateQuestionMutation.mutateAsync({
      id: editingQuestion.id,
      data: questionData as ICreateQuestionRequest,
    });
  }, [editingQuestion, formData, updateQuestionMutation]);

  // Handler for updating only answer part
  const handleUpdateAnswer = useCallback(async () => {
    if (!editingQuestion || !formData.answers) return;

    try {
      // Update each answer individually using the answer API
      const updatePromises = formData.answers.map(async (answer) => {
        console.log("Updating answer:", answer);
        if (answer.id) {
          // Update existing answer
          return updateAnswerMutation.mutateAsync({
            id: answer.id,
            data: {
              answerJp: answer.answerJp,
              isCorrect: answer.isCorrect,
              questionId: editingQuestion.id,
              translations: answer.translations,
            },
          });
        } else {
          // Create new answer
          return createAnswerMutation.mutateAsync({
            answerJp: answer.answerJp,
            isCorrect: answer.isCorrect,
            questionId: editingQuestion.id,
            translations: answer.translations,
          });
        }
      });

      await Promise.all(updatePromises);
      toast.success("Cập nhật đáp án thành công!");
    } catch (error) {
      console.error("Error updating answers:", error);
      toast.error("Có lỗi xảy ra khi cập nhật đáp án");
    }
  }, [
    editingQuestion,
    formData.answers,
    updateAnswerMutation,
    createAnswerMutation,
  ]);

  return {
    // Data
    questions,
    pagination,
    isLoading,
    error,
    filters,
    formData,

    // Dialog states
    isCreateDialogOpen,
    isEditDialogOpen,
    editingQuestion,
    deleteQuestionId,

    // Mutation states
    isCreating: createQuestionMutation.isPending,
    isUpdating: updateQuestionMutation.isPending,
    isDeleting: deleteQuestionMutation.isPending,
    isUpdatingAnswer:
      updateAnswerMutation.isPending || createAnswerMutation.isPending,

    // Handlers
    handleFilterChange,
    handlePageChange,
    handleSort,
    handleCreateQuestion,
    handleEditQuestion,
    handleDeleteQuestion,
    handleUpdateQuestion,
    handleUpdateAnswer,
    openCreateDialog,
    openEditDialog,
    closeDialogs,
    setFormData,
    setDeleteQuestionId,

    // Utility functions
    getQuestionTypeLabel,
    getJLPTLevelLabel,
    resetFormData,

    // Mutations for direct access
    createQuestionMutation,
    updateQuestionMutation,
    deleteQuestionMutation,

    // Dialog state setters
    setIsCreateDialogOpen,
    setIsEditDialogOpen,

    // Loading states
    isLoadingAnswers,

    // Validation
    validationErrors,
    setValidationErrors,
    fieldErrors,
    setFieldErrors,
  };
};
