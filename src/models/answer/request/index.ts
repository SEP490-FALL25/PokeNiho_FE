export interface ICreateAnswerRequest {
    answerJp: string;
    isCorrect: boolean;
    questionId: number;
    translations: {
        meaning: Array<{
            language_code: string;
            value: string;
        }>;
    };
}

export interface IUpdateAnswerRequest extends Partial<ICreateAnswerRequest> {
    id: number;
}

export interface IQueryAnswerRequest {
    questionBankId?: number;
    isCorrect?: boolean;
    page?: number;
    limit?: number;
    search?: string;
}
