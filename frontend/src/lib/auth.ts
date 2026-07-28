export const TOKEN_KEY = "skillmatch_auth_token";
export const USER_INFO_KEY = "skillmatch_user_info";

export const setAuth = (token: string, userInfo: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  }
};

export const clearAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const getUserInfo = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(USER_INFO_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
