import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('access'));

  const login = (newToken) => {
    if (newToken && /^ey[\w-]+\.[\w-]+\.[\w-]+$/.test(newToken)) {
      localStorage.setItem('access', newToken);
      setToken(newToken);
    } else {
      console.warn("Invalid token format");
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    setToken(null);
  };

  // ✅ Sync across tabs
  useEffect(() => {
    const syncToken = () => {
      const stored = localStorage.getItem('access');
      setToken(stored);
    };
    window.addEventListener('storage', syncToken);
    return () => window.removeEventListener('storage', syncToken);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
