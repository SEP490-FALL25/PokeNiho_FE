import { axiosPrivate } from "@configs/axios";
import { QuestionType } from "@constants/questionBank";
import { TestCreateRequest, TestListRequest } from "@models/test/request";
import {
  TestCreateResponseType,
  TestListResponseType,
} from "@models/test/response";
import { TestSetQuestionBankLinkMultipleRequest } from "@models/testSet/request";

const testService = {
  getTests: async (params?: TestListRequest): Promise<TestListResponseType> => {
    const queryParams = new URLSearchParams();

    if (params?.currentPage)
      queryParams.append("currentPage", params.currentPage.toString());
    if (params?.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.levelN) queryParams.append("levelN", params.levelN.toString());
    if (params?.testType) queryParams.append("testType", params.testType);
    if (params?.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    const url = queryString ? `/test?${queryString}` : "/test";

    const response = await axiosPrivate.get(url);
    return response.data;
  },
  createTestWithMeanings: async (
    body: TestCreateRequest
  ): Promise<TestCreateResponseType> => {
    const response = await axiosPrivate.post("/test/with-meanings", body);
    return response.data;
  },
  updateTestWithMeanings: async (
    id: number,
    body: Partial<TestCreateRequest>
  ): Promise<TestCreateResponseType> => {
    const response = await axiosPrivate.put(`/test/${id}/with-meanings`, body);
    return response.data;
  },
  linkQuestionBanksMultiple: async (
    body: TestSetQuestionBankLinkMultipleRequest
  ): Promise<{ message: string } & Record<string, unknown>> => {
    const response = await axiosPrivate.post(
      "/test-questionbank/multiple",
      body
    );
    return response.data;
  },
  // Fetch questions already linked to a TestSet
  getLinkedQuestionBanksByTest: async (
    testId: number
  ): Promise<
    Array<{ id: number; questionJp: string; questionType: QuestionType }>
  > => {
    const response = await axiosPrivate.get(
      `/test-questionbank/test/${testId}/full`
    );
    // API returns { statusCode, data, message }
    return response.data?.data ?? [];
  },
  // Remove linked questions from a TestSet by link/question ids
  deleteLinkedQuestionBanksMany: async (
    ids: number[]
  ): Promise<{ message: string } & Record<string, unknown>> => {
    const response = await axiosPrivate.delete(
      "/test-questionbank/delete-many",
      { data: { ids } }
    );
    return response.data;
  },
};

export default testService;
