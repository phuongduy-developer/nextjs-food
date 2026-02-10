export const UNAUTHORIZED_PATH = {
  LOGIN: "/login",
};

export const AUTHORIZED_PATH = {
  MANAGE: {
    GENERAL: "/manage", 
    DASHBOARD: "/manage/dashboard",
    SETTING: "/manage/setting",
  },
  LOGOUT: "/logout",
};

export const navigation = {
  HOME: "/",
  ...UNAUTHORIZED_PATH,
  ...AUTHORIZED_PATH,
};
