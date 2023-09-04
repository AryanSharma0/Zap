export const header = (authToken) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "auth-token": authToken,
    },
  };
  return config
};