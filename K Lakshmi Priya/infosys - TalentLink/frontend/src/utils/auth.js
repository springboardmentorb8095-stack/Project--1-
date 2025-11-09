//auth.js
export const isLoggedIn = () => {
  const token = localStorage.getItem("access");
  return !!token;
};


export const getToken = () => {
  return localStorage.getItem("access");
};
