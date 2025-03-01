export const isEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isEmpty = (value) => !value.trim();

export const isPhone = (phone) => /^\d{10,12}$/.test(phone.trim());

export const isConfirmPassword = (paswword, confirmPassword) =>
  paswword.trim().toLowerCase() === confirmPassword.trim().toLowerCase();

export const isMinimumLength = (paswword) => paswword.trim().length >= 6;

// Authorization

const TOKEN_CONFIG = {
  TOKEN_KEY: "token",
  REFRESH_TOKEN_KEY: "refresh",
};

export const getStoredToken = () =>
  localStorage.getItem(TOKEN_CONFIG.TOKEN_KEY);

export const getStoredRefreshToken = () =>
  localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);

export const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_CONFIG.TOKEN_KEY, accessToken);
  if (refreshToken)
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_CONFIG.TOKEN_KEY);
  localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
};
