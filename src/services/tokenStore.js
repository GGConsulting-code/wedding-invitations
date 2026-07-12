let accessToken = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = typeof token === "string" && token ? token : null;
};

export const clearAccessToken = () => {
  accessToken = null;
};
