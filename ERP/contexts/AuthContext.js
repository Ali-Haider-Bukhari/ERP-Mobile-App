import React, { createContext, useState,useEffect } from 'react';
import {ToastAndroid } from 'react-native'
import {Python_Url, getToken,storeToken,removeToken,verifyTokenRequest} from "../utils/constants";
import { useNavigation } from '@react-navigation/native';
import { Alert, AlertComponent } from '../components/Alert';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  

  useEffect(() => {  // FOR REFRESH CASE
    getToken()
    .then((token) => {
      // Use the token value here
      verifyTokenRequest(token)
      .then(({ data, error }) => {
        if (error) {
          ToastAndroid.show(error,ToastAndroid.LONG)
          navigation.navigate("Login")
        } else {
          console.log('Response:', data);
          if(data!=null){
            setUser(JSON.parse(data))
            ToastAndroid.show("Authentication Successful!",ToastAndroid.SHORT)
            navigation.navigate("Drawer")
          }else if(token!=null&&data == null){ // TOKEN EXPIRY CASE
            AlertComponent({
              title:'Message',
              message:'Session Expired!!',
              turnOnOkay:false,
              onOkay:()=>{},
              onCancel:()=>{
                ToastAndroid.show("Please Login to Continue",ToastAndroid.SHORT);
                removeToken()
                navigation.navigate("Login")
              }},)
            
            
          }
          // Handle the response data here
        }
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  }, [])

  const login = async (userData) => {
    const url = `${Python_Url}/login`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: null,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        
        console.log(userData,"USER OBJ");
        storeToken(data.token); // STORING TOKEN IN LOCAL STORAGE
        verifyTokenRequest(data.token)
        .then(({ data, error }) => {
          if (error) {
            ToastAndroid.show(error,ToastAndroid.LONG)
            navigation.navigate("Login")
          } else {
            console.log('chk Response:', data);
            setUser(JSON.parse(data))
            ToastAndroid.show("Authentication Successful!",ToastAndroid.SHORT)
            navigation.navigate("Drawer")
            // Handle the response data here
          }
        })
        .catch((error) => {
          console.error('Error:', error.message);
        });
      } else {
        // Login failed
        console.log(data)
        ToastAndroid.show(data.message,ToastAndroid.SHORT)
      }
    } catch (error) {
      // Handle network errors
      ToastAndroid.show("Network Request Error",ToastAndroid.SHORT)
    }
 
  };

  const logout = () => {
    removeToken()
    setUser(null);
    navigation.navigate("Login")
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
