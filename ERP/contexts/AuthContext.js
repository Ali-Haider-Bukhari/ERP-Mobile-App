import React, { createContext, useState } from 'react';
import {ToastAndroid } from 'react-native'
import {Python_Url} from "../utils/constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (userData) => {
    const url = `${Python_Url}/login`
    console.log(userData,"USERDATA",url)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log(data,"RESPONSE")
      if (response.ok) {
        // Successful login
        Alert.alert('Success', 'Login successful');
        // You can handle storing the token or other user data here
      } else {
        // Login failed
        Alert.alert('Error', data.error || 'Login failed');
      }
    } catch (error) {
      // Handle network errors
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred, please try again later');
    }

    /////////////////////////
    ToastAndroid.show("Authentication Failed",ToastAndroid.SHORT)
    navigation.navigate("Drawer")
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
