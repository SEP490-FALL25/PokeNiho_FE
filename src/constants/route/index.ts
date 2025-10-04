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
    DASHBOARD: '/admin',
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

