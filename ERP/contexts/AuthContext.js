import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Perform authentication logic (e.g., API call)
    // If successful, store user data and authentication token
    setUser(userData);
  };

  const logout = () => {
    // Perform logout logic (e.g., clear stored user data and token)
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
