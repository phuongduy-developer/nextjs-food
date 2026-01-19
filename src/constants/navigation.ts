

export const UNAUTHORIZED_PATH = {
    LOGIN: '/login',
}

export const AUTHORIZED_PATH = {
    MANAGE: {
        DASHBOARD: '/manage/dashboard',
        SETTING: '/manage/setting',

    }
}

export const navigation = {
    ...UNAUTHORIZED_PATH,
    ...AUTHORIZED_PATH,
    HOME: '/',

}