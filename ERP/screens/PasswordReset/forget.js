import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ActivityIndicator , ToastAndroid } from 'react-native';
import { Python_Url , getToken } from "../../utils/constants";
const Logo = require("../../assets/logo.png");
import { AlertComponent } from "../../components/Alert";
import { useNavigation } from '@react-navigation/native';






  function PasswordResetScreen() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationEntered, setVerificationEntered] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [showSetPassword, setShowSetPassword] = useState(false);
    const navigation = useNavigation();
    const handleResetPassword = async () => {
      try {

if(email){

        setLoading(true);
  
        const url = `${Python_Url}/forgetverify`;
  
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email }),
        });
        
        const data = await response.json();
        
        if (data.status === 400) {
          AlertComponent({
            title: 'Error sending Email',
            message: 'This email account does not exist!',
            turnOnOkay: false,
            onOkay: () => {},
            onCancel: () => {}
          });
        } else if (response.ok) {
          setShowVerification(true);
          setVerificationCode(data?.verification);
        }
        
        setLoading(false);
      }
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setLoading(false);
      }
    };
  
    const handleVerifyCode = () => {
      if (verificationCode === verificationEntered) {
        setShowVerification(false);
        setShowSetPassword(true);
      } else {
        // Display an alert or error message indicating incorrect code
        AlertComponent({
          title: 'Error Code not match',
          message: 'error message indicating incorrect code!!',
          turnOnOkay: false,
          onOkay: () => {},
          onCancel: () => {}
        });
      }
    };
  
    const handleSetPassword = async () => {
      // Perform password update logic here
      try {
        setLoading(true);
  
        const url = `${Python_Url}/setpassword`;
  
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email, password: newPassword }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
         
          AlertComponent({
            title:'New Password Create success',
            message:'congrats your password chnage sucess',
            turnOnOkay:false,
            onOkay:()=>{},
            onCancel:()=>{
              ToastAndroid.show("Please Login to Continue",ToastAndroid.SHORT);
            
            }},)


          setNewPassword('');
          setConfirmPassword('');
          setLoading(false);
        } else {
          // setMessage(data.error);
          setLoading(false);
        }
  
       
      } catch (error) {
        console.error('Error setting password:', error);
        setMessage('An error occurred while setting password');
        setLoading(false);
      }


    };
  
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={Logo} />
        <View style={styles.formContainer}>
          {!showVerification && !showSetPassword && (
            <>
              <Text style={styles.header}>Reset Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
              />
              <Button
                title={loading ? 'Loading...' : 'Send'}
                onPress={handleResetPassword}
                disabled={loading}
              />
            </>
          )}
          {showVerification && (
            <>
              <Text style={styles.header}>Enter Verification Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Verification Code"
                value={verificationEntered}
                onChangeText={setVerificationEntered}
              />
              <Button
                title="Verify Code"
                onPress={handleVerifyCode}
              />
            </>
          )}
          {showSetPassword && (
            <>
              <Text style={styles.header}>Set New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            <Button
        title={loading ? 'Loading...' : 'Save'}
        onPress={handleSetPassword}
        disabled={loading || !email || !newPassword || newPassword !== confirmPassword}
      />
     
            </>
          )}
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1 ,
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