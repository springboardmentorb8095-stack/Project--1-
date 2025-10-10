import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access'));

  const login = (newToken) => {
    localStorage.setItem('access', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('access');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
