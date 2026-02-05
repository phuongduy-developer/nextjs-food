

export const UNAUTHORIZED_PATH = {
    LOGIN: '/login',
    HOME: '/',
}

export const AUTHORIZED_PATH = {
    MANAGE: {
        DASHBOARD: '/manage/dashboard',
        SETTING: '/manage/setting',
    },
    LOGOUT: '/logout'
}

export const navigation = {
    ...UNAUTHORIZED_PATH,
    ...AUTHORIZED_PATH,
}