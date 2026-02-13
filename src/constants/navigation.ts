export const UNAUTHORIZED_PATH = {
  LOGIN: "/login",
  LOGOUT: "/logout",
  REFRESHTOKEN: '/refresh-token',
  HOME: "/",
};

export const AUTHORIZED_PATH = {
  MANAGE: {
    GENERAL: "/manage", 
    DASHBOARD: "/manage/dashboard",
    SETTING: "/manage/setting",
  },
};

export const navigation = {
  ...UNAUTHORIZED_PATH,
  ...AUTHORIZED_PATH,
};
