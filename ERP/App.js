import { StatusBar } from 'expo-status-bar';
import {  Text, View } from 'react-native';
import { useEffect,useState } from 'react';
import Splash from './components/Splash/Splash';
export default function App() {

  return (
    <View>
      <Splash/>
      <StatusBar style="auto" />
    </View>
  );
}
 
