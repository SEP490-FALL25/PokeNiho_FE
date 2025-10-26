export const REWARD_TYPE = {
    LESSON: 'LESSON',
    DAILY_REQUEST: 'DAILY_REQUEST',
    EVENT: 'EVENT',
    ACHIEVEMENT: 'ACHIEVEMENT',
    LEVEL: 'LEVEL',
} as const;

export const REWARD_TARGET = {
    EXP: 'EXP',
    POINT: 'POINT',
    POKEMON: 'POKEMON',
    BADGE: 'BADGE',
} as const;

export const REWARD = {
    REWARD_TYPE,
    REWARD_TARGET,
}

export type IREWARD = typeof REWARD;