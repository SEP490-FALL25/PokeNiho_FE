export const QUESTION_TYPE = {
    VOCABULARY: 'VOCABULARY',
    GRAMMAR: 'GRAMMAR', 
    KANJI: 'KANJI',
    LISTENING: 'LISTENING',
    READING: 'READING',
    SPEAKING: 'SPEAKING'
} as const;

export const JLPT_LEVEL = {
    N5: 5,
    N4: 4,
    N3: 3,
    N2: 2,
    N1: 1
} as const;

export const QUESTION_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED'
} as const;

export const QUESTION_TYPE_LABELS = {
    [QUESTION_TYPE.VOCABULARY]: 'Từ vựng',
    [QUESTION_TYPE.GRAMMAR]: 'Ngữ pháp',
    [QUESTION_TYPE.KANJI]: 'Hán tự',
    [QUESTION_TYPE.LISTENING]: 'Nghe hiểu',
    [QUESTION_TYPE.READING]: 'Đọc hiểu',
    [QUESTION_TYPE.SPEAKING]: 'Nói'
} as const;

export const JLPT_LEVEL_LABELS = {
    [JLPT_LEVEL.N5]: 'N5',
    [JLPT_LEVEL.N4]: 'N4',
    [JLPT_LEVEL.N3]: 'N3',
    [JLPT_LEVEL.N2]: 'N2',
    [JLPT_LEVEL.N1]: 'N1'
} as const;

export const QUESTION_STATUS_LABELS = {
    [QUESTION_STATUS.ACTIVE]: 'Hoạt động',
    [QUESTION_STATUS.INACTIVE]: 'Không hoạt động',
    [QUESTION_STATUS.DRAFT]: 'Bản nháp',
    [QUESTION_STATUS.PUBLISHED]: 'Đã xuất bản'
} as const;

export type QuestionType = typeof QUESTION_TYPE[keyof typeof QUESTION_TYPE];
export type JLPTLevel = typeof JLPT_LEVEL[keyof typeof JLPT_LEVEL];
export type QuestionStatus = typeof QUESTION_STATUS[keyof typeof QUESTION_STATUS];
