//auth.js
export const isLoggedIn = () => {
  const token = localStorage.getItem("access");
  return !!token;
};
