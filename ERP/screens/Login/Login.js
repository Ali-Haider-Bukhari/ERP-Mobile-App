import React, { useState,useContext } from 'react';
import { Text, View, Image, TextInput, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './Styles';
import { AuthContext } from '../../contexts/AuthContext';
const Logo = require("../../assets/logo.png");
 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login} = useContext(AuthContext);

  const navigation = useNavigation(); // Access navigation object

  const handleInputChangeUser = (text) => {
    setEmail(text);
  };

  const handleInputChangePass = (text) => {
    setPassword(text);
  };

  const handleResetPassword = () => {
    navigation.navigate('PasswordReset');
  };

  const handleButtonPress = (text) => {
    const dataObj = {email,password}
    login(dataObj)
  };


  return (
   
      <View style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
              <Image style={styles.logo} source={Logo} />
              <Text style={styles.bannerText}>Superior University</Text>
              <Text style={styles.bannerText2}>Campus Management Solution</Text>
              <Text style={styles.bannerText3}>Note: For admission applicants only, Please enter your CNIC (i.e 8230136298285) or Passport # as your User ID. Kindly use Google Chrome to singup and submit application form.</Text>
              <TextInput
                style={styles.input1}
                placeholder="User ID"
                onChangeText={handleInputChangeUser}
                value={email}
              />
              <TextInput
                style={styles.input2}
                placeholder="Password"
                onChangeText={handleInputChangePass}
                value={password}
                secureTextEntry={true}
              />
              <View style={styles.button}>
                <Button color={"rgba(117, 0, 88,255)"} title="Log in" onPress={handleButtonPress}></Button>
              </View>
              <View style={styles.reset}>
                <Text onPress={handleResetPassword}>Reset Password</Text>
              </View>
          </View>
        </View>
      </View>
  
  );
}

export default Login;
