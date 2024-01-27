import React, { useEffect, useRef, useState } from 'react';
import { Animated, ActivityIndicator, Text, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styles from './Styles';

const Logo = require("../../assets/logo.png");

function Splash() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const [flag,setFlag] = useState(false)

  useEffect(() => {
    setTimeout(() => {
        setFlag(true)
    }, 7000); 
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 5000, // Adjust the duration as needed
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        delay: 5000,
        toValue: -100,
        duration: 1000, // Adjust the duration as needed
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateYAnim]);
 

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] },
        ]}
      >
        <Image source={Logo} style={styles.logo}/>
        <View style={{height:'20px'}}>
          {flag?<Text style={styles.text}>The Superior University</Text>:<Text style={styles.text}>{"      "} </Text>}
        </View>
      </Animated.View>
    
      <View style={{height:'20px'}}>
        {flag?<ActivityIndicator style={styles.spinner} size="large" color="#6495ED" />:<Text style={styles.text}>{"      "} </Text>}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

export default Splash;
