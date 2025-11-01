import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import testService from "@services/test";
import { TestListRequest, TestCreateRequest } from "@models/test/request";
import { TestSetQuestionBankLinkMultipleRequest } from "@models/testSet/request";
import { selectCurrentLanguage } from "@redux/features/language/selector";
import { useSelector } from "react-redux";
import { AxiosError } from "axios";

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string | string[];
    };
  };
}

/**
 * Helper function to extract error message from axios error response
 */
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (message) {
      return Array.isArray(message) ? message.join(", ") : message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};

/**
 * Hook for managing Test list with filters and pagination
 * @param filters TestListRequest
 * @returns { data, isLoading, error, pagination }
 */
export const useTestList = (
  filters: TestListRequest,
  options?: { enabled?: boolean; forceKey?: number }
) => {
  const language = useSelector(selectCurrentLanguage);

  const { data, isLoading, error } = useQuery({
    queryKey: ["test-list", filters, language, options?.forceKey],
    queryFn: () => testService.getTests(filters),
    enabled: options?.enabled ?? true,
  });

  return {
    data: data?.data?.results || [],
    pagination: data?.data?.pagination || {
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
 * Hook for creating a new test
 * @returns mutation object with createTest function
 */
export const useCreateTest = () => {
  const queryClient = useQueryClient();

  const createTestMutation = useMutation({
    mutationFn: (data: TestCreateRequest) =>
      testService.createTestWithMeanings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-list"] });
      queryClient.invalidateQueries({ queryKey: ["testset-list"] });
    },
    onError: (error: unknown) => {
      console.error("Error creating test:", error);
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
          getErrorMessage(error, "Có lỗi xảy ra khi tạo test")
        );
      }
    },
  });

  return createTestMutation;
};

/**
 * Hook for updating a test
 * @returns mutation object with updateTest function
 */
export const useUpdateTest = () => {
  const queryClient = useQueryClient();

  const updateTestMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<TestCreateRequest>;
    }) => testService.updateTestWithMeanings(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-list"] });
      queryClient.invalidateQueries({ queryKey: ["testset-list"] });
    },
    onError: (error: unknown) => {
      console.error("Error updating test:", error);
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
          getErrorMessage(error, "Có lỗi xảy ra khi cập nhật test")
        );
      }
    },
  });

  return updateTestMutation;
};

/**
 * Hook for linking question banks to a test
 * @returns mutation object with linkQuestionBanks function
 */
export const useLinkQuestionBanks = () => {
  const queryClient = useQueryClient();

  const linkQuestionBanksMutation = useMutation({
    mutationFn: (data: TestSetQuestionBankLinkMultipleRequest) =>
      testService.linkQuestionBanksMultiple(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question-bank-list"] });
      queryClient.invalidateQueries({ queryKey: ["test-list"] });
      queryClient.invalidateQueries({ queryKey: ["testset-list"] });
    },
    onError: (error: unknown) => {
      console.error("Error linking question banks:", error);
      toast.error(
        getErrorMessage(error, "Có lỗi xảy ra khi liên kết câu hỏi")
      );
    },
  });

  return linkQuestionBanksMutation;
};

/**
 * Hook for fetching linked question banks by test ID
 * @param testId number
 * @param options { enabled?: boolean }
 * @returns { data, isLoading, error }
 */
export const useGetLinkedQuestionBanks = (
  testId: number | null,
  options?: { enabled?: boolean }
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["test-linked-question-banks", testId],
    queryFn: () => testService.getLinkedQuestionBanksByTest(testId!),
    enabled: (options?.enabled ?? true) && testId !== null,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};

/**
 * Hook for deleting linked question banks
 * @returns mutation object with deleteLinkedQuestionBanks function
 */
export const useDeleteLinkedQuestionBanks = () => {
  const queryClient = useQueryClient();

  const deleteLinkedQuestionBanksMutation = useMutation({
    mutationFn: (ids: number[]) =>
      testService.deleteLinkedQuestionBanksMany(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-linked-question-banks"] });
      queryClient.invalidateQueries({ queryKey: ["question-bank-list"] });
      queryClient.invalidateQueries({ queryKey: ["test-list"] });
      queryClient.invalidateQueries({ queryKey: ["testset-list"] });
    },
    onError: (error: unknown) => {
      console.error("Error deleting linked question banks:", error);
      toast.error(
        getErrorMessage(error, "Có lỗi xảy ra khi xóa câu hỏi")
      );
    },
  });

  return deleteLinkedQuestionBanksMutation;
};

/**
 * Main hook for Test management with all CRUD operations and state management
 * @returns Complete Test management interface
 */
export const useTest = () => {
  const [filters, setFilters] = useState<TestListRequest>({
    currentPage: 1,
    pageSize: 15,
  });

  const { data: tests, pagination, isLoading, error } = useTestList(filters);

  const handleSetFilters = useCallback((newFilters: Partial<TestListRequest>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      currentPage: 1, // Reset to first page when filters change
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      currentPage: page,
    }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilters((prev) => ({
      ...prev,
      pageSize,
      currentPage: 1, // Reset to first page when page size changes
    }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => ({
      ...prev,
      search: search || undefined,
      currentPage: 1,
    }));
  }, []);

  const handleFilterByLevel = useCallback((levelN: number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      levelN,
      currentPage: 1,
    }));
  }, []);

  const handleFilterByTestType = useCallback(
    (testType: TestListRequest["testType"]) => {
      setFilters((prev) => ({
        ...prev,
        testType,
        currentPage: 1,
      }));
    },
    []
  );

  const handleFilterByStatus = useCallback(
    (status: TestListRequest["status"]) => {
      setFilters((prev) => ({
        ...prev,
        status,
        currentPage: 1,
      }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({
      currentPage: 1,
      pageSize: 15,
    });
  }, []);

  return {
    tests,
    pagination,
    isLoading,
    error,
    filters,
    setFilters: handleSetFilters,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleFilterByLevel,
    handleFilterByTestType,
    handleFilterByStatus,
    clearFilters,
  };
};

