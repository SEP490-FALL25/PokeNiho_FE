const AUTH = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    UNAUTHORIZED: '/auth/unauthorized',
    LOGOUT: '/auth/logout',
};

const PUBLIC = {
    HOME: '/',
}

const ADMIN = {
    ROOT: '/admin/overview',
    USERS: '/admin/users',
    LESSONS: '/admin/lessons',
    VOCABULARY: '/admin/vocabulary',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
    PACKAGE_MANAGEMENT: '/admin/package-management',
    POKEMON_MANAGEMENT: '/admin/pokemon-management',
    TOURNAMENT_MANAGEMENT: '/admin/tournament-management',
    AI_PROMPTS_MANAGEMENT: '/admin/ai-prompts-management',
    DAILY_QUEST_MANAGEMENT: '/admin/daily-quest-management',
};

const ROLE = {
    ADMIN: "admin",
    INSTRUCTOR: "instructor",
    STUDENT: "student",
};

export const ROUTES = {
    AUTH,
    PUBLIC,
    ADMIN,
    ROLE,
};

