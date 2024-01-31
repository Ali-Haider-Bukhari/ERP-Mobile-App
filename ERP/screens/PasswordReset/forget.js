"use client"
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import {Python_Url} from "../../utils/constants";
const Logo = require("../../assets/logo.png");

const PasswordResetScreen = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    console.log(Python_Url , email , "get in send funct")
    // try {
    //   const response = await fetch(`http://192.168.1.101:5000/forgetverify`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json', // Specify the content type
    //     },
    //     body: JSON.stringify({ email }), // Convert the data to JSON format
    //   });
  
    //   if (response.ok) {
    //     // Alert.alert('Password Reset Email Sent', 'Check your email for further instructions.');
    //   } else {
    //     // Alert.alert('Error', 'User not found or failed to send email.');
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   // Alert.alert('Error', 'Failed to connect to the server.');
    // }
  };
  

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={Logo} />
      <View style={styles.formContainer}>
        <Text style={styles.header}>Reset Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
        <Button title="Send" onPress={handleResetPassword} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  formContainer: {
    width: '80%',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default PasswordResetScreen;
