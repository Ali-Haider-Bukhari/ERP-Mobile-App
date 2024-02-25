import {  Text, View,Image } from 'react-native';
// import { useEffect,useState } from 'react';
import Splash from './screens/Splash/Splash';
import Login from './screens/Login/Login';
import PasswordReset from "./screens/PasswordReset/forget";
import DrawerScreen from "./screens/Drawer/Drawer";

import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GlobalProvider } from './contexts/GlobalContext';


export default function App() {

  const Stack = createStackNavigator(); 

  return (
    <GlobalProvider>

        <NavigationContainer>   
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false}} />
            <Stack.Screen  name="Login" component={Login} options={{ headerShown: true,
                                                                    headerTitleStyle: { color: 'white' },
                                                                    headerTitle: () => (<>
                                                                     <View style={{display:'flex',flexDirection:'row',width:'100%'}}> 
                                                                      <Image
                                                                        source={require('./assets/logo.png')} 
                                                                        style={{ width: 90, height: 90, borderRadius: 15,marginTop:30 }} 
                                                                      />
                                                                      <Text style={{marginTop:50,color:'white',fontSize:20}}>Superior University</Text>
                                                                      </View>
                                                                      </>
                                                                    ),
                                                                    headerStyle: { backgroundColor: 'rgba(117, 0, 88,255)' },
                                                                    headerLeft: () => null,}}/>
       
          <Stack.Screen name="Drawer" component={DrawerScreen} options={{ headerShown: false}}/>
          <Stack.Screen name="PasswordReset" component={PasswordReset} />
          </Stack.Navigator>      
        </NavigationContainer>

    </GlobalProvider>
  ); 
}
 
