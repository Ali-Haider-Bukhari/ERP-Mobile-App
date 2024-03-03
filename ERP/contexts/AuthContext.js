import React, { createContext, useState } from 'react';
import {ToastAndroid } from 'react-native'
import {Python_Url} from "../utils/constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (userData) => {
    const url = `${Python_Url}/login`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        setUser(userData);
        ToastAndroid.show("Authentication Successful!",ToastAndroid.SHORT)
        navigation.navigate("Drawer")
        // You can handle storing the token or other user data here
      } else {
        // Login failed
        ToastAndroid.show(data.error,ToastAndroid.SHORT)
      }
    } catch (error) {
      // Handle network errors
      ToastAndroid.show("Network Request Error",ToastAndroid.SHORT)
    }
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
