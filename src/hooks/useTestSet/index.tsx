import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import testSetService from "@services/testSet";
import { TestSetListRequest } from "@models/testSet/request";
import { selectCurrentLanguage } from "@redux/features/language/selector";
import { useSelector } from "react-redux";



/**
 * Hook for managing TestSet list with filters and pagination
 * @param filters TestSetListRequest
 * @returns { data, isLoading, error, pagination }
 */
export const useTestSetList = (
  filters: TestSetListRequest,
  options?: { enabled?: boolean }
) => {
  const language = useSelector(selectCurrentLanguage);

  const { data, isLoading, error } = useQuery({
    queryKey: ["testset-list", filters, language],
    queryFn: () => testSetService.getTestSets(filters),
    enabled: options?.enabled ?? true,
  });

  return {
    data: data?.data?.results || [],
    pagination: data?.data?.pagination || {
      current: 1,
      pageSize: 10,
      totalPage: 1,
      totalItem: 0,
    },
    isLoading,
    error,
  };
};

/**
 * Hook for managing TestSet state and operations
 * @returns { testSets, isLoading, error, pagination, filters, setFilters, refetch }
 */
export const useTestSet = () => {
  const [filters, setFilters] = useState<TestSetListRequest>({
    currentPage: 1,
    pageSize: 10,
  });

  const { data: testSets, pagination, isLoading, error } = useTestSetList(filters);

  const handleSetFilters = useCallback((newFilters: Partial<TestSetListRequest>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      currentPage: 1, // Reset to first page when filters change
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({
      ...prev,
      currentPage: page,
    }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilters(prev => ({
      ...prev,
      pageSize,
      currentPage: 1, // Reset to first page when page size changes
    }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setFilters(prev => ({
      ...prev,
      search: search || undefined,
      currentPage: 1,
    }));
  }, []);

  const handleFilterByLevel = useCallback((levelN: number | undefined) => {
    setFilters(prev => ({
      ...prev,
      levelN,
      currentPage: 1,
    }));
  }, []);

  const handleFilterByTestType = useCallback((testType: TestSetListRequest['testType']) => {
    setFilters(prev => ({
      ...prev,
      testType,
      currentPage: 1,
    }));
  }, []);

  const handleFilterByStatus = useCallback((status: TestSetListRequest['status']) => {
    setFilters(prev => ({
      ...prev,
      status,
      currentPage: 1,
    }));
  }, []);

  const handleFilterByCreator = useCallback((creatorId: number | undefined) => {
    setFilters(prev => ({
      ...prev,
      creatorId,
      currentPage: 1,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      currentPage: 1,
      pageSize: 10,
    });
  }, []);

  return {
    testSets,
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
    handleFilterByCreator,
    clearFilters,
  };
};
