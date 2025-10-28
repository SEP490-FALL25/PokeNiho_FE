import { IQueryRequest } from "@models/common/request";
import { QuestionType, JLPTLevel, QuestionStatus } from "@constants/questionBank";

export interface ICreateQuestionRequest {
    questionJp: string;
    questionType: QuestionType;
    levelN: JLPTLevel;
    audioUrl?: string | null;
    pronunciation?: string;
    meanings: {
        translations: {
            vi: string;
            en: string;
        };
    };
    answers?: Array<{
        answerJp: string;
        isCorrect: boolean;
        translations: {
            meaning: Array<{
                language_code: string;
                value: string;
            }>;
        };
    }>;
}

export interface IUpdateQuestionRequest extends Partial<ICreateQuestionRequest> {
    id: number;
}

export interface IQueryQuestionRequest extends IQueryRequest {
    levelN?: JLPTLevel;
    questionType?: QuestionType;
    status?: QuestionStatus;
    search?: string;
    difficulty?: number;
    tags?: string[];
}

export interface IBulkCreateQuestionRequest {
    questions: ICreateQuestionRequest[];
}

export interface IBulkDeleteQuestionRequest {
    ids: number[];
}

export interface IBulkUpdateQuestionRequest {
    questions: IUpdateQuestionRequest[];
}
