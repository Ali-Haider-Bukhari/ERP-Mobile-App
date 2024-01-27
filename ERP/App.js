import {  Text, View } from 'react-native';
import { useEffect,useState } from 'react';
import Splash from './screens/Splash/Splash';
import Login from './screens/Login/Login'
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
export default function App() {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>   
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: true ,headerBackground:'green'}}/>
      </Stack.Navigator>      
    </NavigationContainer>
  ); 
}
 
