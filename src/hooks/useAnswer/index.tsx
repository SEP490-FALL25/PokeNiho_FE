import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import answerService from "@services/answer";
import {
  IQueryAnswerRequest,
  ICreateAnswerRequest,
} from "@models/answer/request";
import { AnswerEntityType } from "@models/answer/entity";
import { selectCurrentLanguage } from "@redux/features/language/selector";
import { useSelector } from "react-redux";

/**
 * Hook for managing Answer list with filters and pagination
 * @param filters IQueryAnswerRequest
 * @returns { data, isLoading, error, pagination }
 */
export const useAnswerList = (filters: IQueryAnswerRequest) => {
  const currentLanguage = useSelector(selectCurrentLanguage);
  const { data, isLoading, error } = useQuery({
    queryKey: ["answer-list", filters, currentLanguage],
    queryFn: () => answerService.getAnswerList(filters),
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
 * Hook for creating a new answer
 * @returns mutation object with createAnswer function
 */
export const useCreateAnswer = () => {
  const queryClient = useQueryClient();

  const createAnswerMutation = useMutation({
    mutationFn: (data: ICreateAnswerRequest) =>
      answerService.createAnswer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answer-list"] });
    },
  });
  console.log(createAnswerMutation);
  return createAnswerMutation;
};

/**
 * Hook for updating an answer
 * @returns mutation object with updateAnswer function
 */
export const useUpdateAnswer = () => {
  const queryClient = useQueryClient();

  const updateAnswerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ICreateAnswerRequest }) =>
      answerService.updateAnswer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answer-list"] });
    },
  });

  return updateAnswerMutation;
};

/**
 * Hook for deleting an answer
 * @returns mutation object with deleteAnswer function
 */
export const useDeleteAnswer = () => {
  const queryClient = useQueryClient();

  const deleteAnswerMutation = useMutation({
    mutationFn: (id: number) => answerService.deleteAnswer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answer-list"] });
    },
  });

  return deleteAnswerMutation;
};

/**
 * Main hook for Answer management with all CRUD operations and state management
 * @param initialFilters IQueryAnswerRequest
 * @returns Complete Answer management interface
 */
export const useAnswer = (
  initialFilters: IQueryAnswerRequest = {
    page: 1,
    limit: 15,
    search: "",
    questionBankId: undefined,
    isCorrect: undefined,
  }
) => {
  // State management
  const [filters, setFilters] = useState<IQueryAnswerRequest>(initialFilters);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<AnswerEntityType | null>(
    null
  );
  const [deleteAnswerId, setDeleteAnswerId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<ICreateAnswerRequest>({
    answerJp: "",
    isCorrect: false,
    questionBankId: 0,
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
  });

  // API hooks
  const {
    data: answers,
    pagination,
    isLoading,
    error,
  } = useAnswerList(filters);
  const createAnswerMutation = useCreateAnswer();
  const updateAnswerMutation = useUpdateAnswer();
  const deleteAnswerMutation = useDeleteAnswer();

  // Filter handlers
  const handleFilterChange = useCallback(
    (
      key: keyof IQueryAnswerRequest,
      value: string | number | boolean | undefined
    ) => {
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
      answerJp: "",
      isCorrect: false,
      questionBankId: 0,
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
    });
  }, []);

  // CRUD operations
  const handleCreateAnswer = useCallback(async () => {
    try {
      // Check if this is a MATCHING question and already has an answer
      if (formData.questionBankId && answers.length > 0) {
        // This check should be done at the UI level, but adding as backup
        console.warn("MATCHING questions can only have 1 answer");
        return;
      }

      await createAnswerMutation.mutateAsync(formData);
      setIsCreateDialogOpen(false);
      resetFormData();
    } catch (error) {
      console.error("Error creating answer:", error);
    }
  }, [formData, createAnswerMutation, resetFormData, answers.length]);

  const handleEditAnswer = useCallback(async () => {
    if (!editingAnswer) return;
    try {
      await updateAnswerMutation.mutateAsync({
        id: editingAnswer.id,
        data: formData,
      });
      setIsEditDialogOpen(false);
      setEditingAnswer(null);
    } catch (error) {
      console.error("Error updating answer:", error);
    }
  }, [editingAnswer, formData, updateAnswerMutation]);

  const handleDeleteAnswer = useCallback(async () => {
    if (!deleteAnswerId) return;
    try {
      await deleteAnswerMutation.mutateAsync(deleteAnswerId);
      setDeleteAnswerId(null);
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  }, [deleteAnswerId, deleteAnswerMutation]);

  // Dialog handlers
  const openCreateDialog = useCallback(
    (questionBankId: number) => {
      resetFormData();
      setFormData((prev) => ({ ...prev, questionBankId }));
      setIsCreateDialogOpen(true);
    },
    [resetFormData]
  );

  const openEditDialog = useCallback((answer: AnswerEntityType) => {
    setEditingAnswer(answer);
    setFormData({
      answerJp: answer.answerJp,
      isCorrect: answer.isCorrect,
      questionBankId: answer.questionBankId,
      translations: answer.translations,
    });
    setIsEditDialogOpen(true);
  }, []);

  const closeDialogs = useCallback(() => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingAnswer(null);
  }, []);

  return {
    // Data
    answers,
    pagination,
    isLoading,
    error,
    filters,
    formData,

    // Dialog states
    isCreateDialogOpen,
    isEditDialogOpen,
    editingAnswer,
    deleteAnswerId,

    // Mutation states
    isCreating: createAnswerMutation.isPending,
    isUpdating: updateAnswerMutation.isPending,
    isDeleting: deleteAnswerMutation.isPending,

    // Handlers
    handleFilterChange,
    handlePageChange,
    handleCreateAnswer,
    handleEditAnswer,
    handleDeleteAnswer,
    openCreateDialog,
    openEditDialog,
    closeDialogs,
    setFormData,
    setDeleteAnswerId,

    // Utility functions
    resetFormData,
  };
};
