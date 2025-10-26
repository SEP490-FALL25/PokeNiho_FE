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
    meaning: "",
    audioUrl: "",
    options: [],
    correctAnswer: "",
    explanation: "",
    difficulty: 1,
    points: 10,
    timeLimit: 60,
    tags: [],
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

  // Reset form data
  const resetFormData = useCallback(() => {
    setFormData({
      questionJp: "",
      questionType: QUESTION_TYPE.VOCABULARY,
      levelN: JLPT_LEVEL.N5,
      pronunciation: "",
      meaning: "",
      audioUrl: "",
      options: [],
      correctAnswer: "",
      explanation: "",
      difficulty: 1,
      points: 10,
      timeLimit: 60,
      tags: [],
    });
  }, []);

  // CRUD operations
  const handleCreateQuestion = useCallback(async () => {
    try {
      await createQuestionMutation.mutateAsync(formData);
      setIsCreateDialogOpen(false);
      resetFormData();
    } catch (error) {
      console.error("Error creating question:", error);
    }
  }, [formData, createQuestionMutation, resetFormData]);

  const handleEditQuestion = useCallback(async () => {
    if (!editingQuestion) return;
    try {
      await updateQuestionMutation.mutateAsync({
        id: editingQuestion.id,
        data: formData,
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

  // Dialog handlers
  const openCreateDialog = useCallback(() => {
    resetFormData();
    setIsCreateDialogOpen(true);
  }, [resetFormData]);

  const openEditDialog = useCallback((question: QuestionEntityType) => {
    setEditingQuestion(question);
    setFormData({
      questionJp: question.questionJp,
      questionType: question.questionType as QuestionType,
      levelN: question.levelN as JLPTLevel,
      pronunciation: question.pronunciation,
      meaning: question.meaning,
      audioUrl: question.audioUrl || "",
      options: question.options || [],
      correctAnswer: question.correctAnswer || "",
      explanation: question.explanation || "",
      difficulty: question.difficulty || 1,
      points: question.points || 10,
      timeLimit: question.timeLimit || 60,
      tags: question.tags || [],
    });
    setIsEditDialogOpen(true);
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
  };
};
