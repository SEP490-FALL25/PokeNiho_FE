import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    });
  }, []);

  // CRUD operations
  const handleCreateQuestion = useCallback(async () => {
    try {
      // Clean up form data before sending
      const cleanedFormData = {
        ...formData,
        audioUrl: formData.audioUrl === "" ? null : formData.audioUrl,
        // Remove options for VOCABULARY type
        ...(formData.questionType === "VOCABULARY" && { options: undefined }),
        // Remove correctAnswer for all types
        correctAnswer: undefined,
      };
      
      // Log the payload for debugging
      console.log("Creating question with payload:", JSON.stringify(cleanedFormData, null, 2));
      
      await createQuestionMutation.mutateAsync(cleanedFormData);
      setIsCreateDialogOpen(false);
      resetFormData();
    } catch (error) {
      console.error("Error creating question:", error);
    }
  }, [formData, createQuestionMutation, resetFormData]);

  const handleEditQuestion = useCallback(async () => {
    if (!editingQuestion) return;
    try {
      // Clean up form data before sending
      const cleanedFormData = {
        ...formData,
        audioUrl: formData.audioUrl === "" ? null : formData.audioUrl,
        // Remove options for VOCABULARY type
        ...(formData.questionType === "VOCABULARY" && { options: undefined }),
        // Remove correctAnswer for all types
        correctAnswer: undefined,
      };
      await updateQuestionMutation.mutateAsync({
        id: editingQuestion.id,
        data: cleanedFormData,
      });
      setIsEditDialogOpen(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  }, [editingQuestion, formData, updateQuestionMutation]);

  const handleDeleteQuestion = useCallback(async () => {
    if (!deleteQuestionId) return;
    try {
      await deleteQuestionMutation.mutateAsync(deleteQuestionId);
      setDeleteQuestionId(null);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  }, [deleteQuestionId, deleteQuestionMutation]);

  // State for loading answers
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);

  // Dialog handlers
  const openCreateDialog = useCallback(() => {
    resetFormData();
    setIsCreateDialogOpen(true);
  }, [resetFormData]);

  const openEditDialog = useCallback(async (question: QuestionEntityType) => {
    setEditingQuestion(question);
    setIsEditDialogOpen(true);
    
    // Set basic question data immediately
    setFormData({
      questionJp: question.questionJp,
      questionType: question.questionType as QuestionType,
      levelN: question.levelN as JLPTLevel,
      pronunciation: question.pronunciation || "",
      audioUrl: question.audioUrl || "",
      meanings: Array.isArray(question.meanings) ? question.meanings : [
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
      console.log(fetchedAnswers)
      // Transform the fetched answers to match the form structure
      const formattedAnswers = fetchedAnswers.map((answer) => ({
        answerJp: answer.answerJp,
        isCorrect: answer.isCorrect,
        translations: answer.translations,
      }));

      // Update form data with fetched answers
      setFormData((prev) => ({
        ...prev,
        answers: formattedAnswers.length > 0 ? formattedAnswers : [
          {
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
    } catch (error) {
      console.error("Error fetching answers:", error);
      // If fetching fails, use empty answers
      setFormData((prev) => ({
        ...prev,
        answers: [
          {
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
  }, []);

  // Get current language
  const language = useSelector(selectCurrentLanguage);

  // Utility functions
  const getQuestionTypeLabel = useCallback((type: string) => {
    const labels = QUESTION_TYPE_LABELS[language as keyof typeof QUESTION_TYPE_LABELS];
    return labels?.[type as keyof typeof labels] || type;
  }, [language]);

  const getJLPTLevelLabel = useCallback((level: number) => {
    const labels = JLPT_LEVEL_LABELS[language as keyof typeof JLPT_LEVEL_LABELS];
    return labels?.[level as keyof typeof labels] || `N${level}`;
  }, [language]);

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

    // Handlers
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
  };
};
