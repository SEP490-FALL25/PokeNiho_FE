import { IQueryRequest } from "@models/common/request";
import { QuestionType, JLPTLevel, QuestionStatus } from "@constants/questionBank";

export interface ICreateQuestionRequest {
    questionJp: string;
    questionType: QuestionType;
    levelN: JLPTLevel;
    pronunciation: string;
    meaning: string;
    audioUrl?: string | null;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
    difficulty?: number;
    points?: number;
    timeLimit?: number; // in seconds
    tags?: string[];
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
