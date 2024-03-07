import { GlobalProvider } from './contexts/GlobalContext';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './components/Navigation.js';
import { AuthProvider } from './contexts/AuthContext.js';

export default function App(){
  return (
    <GlobalProvider>
      <NavigationContainer>   
        <AuthProvider>
           <Navigation/>
        </AuthProvider>
      </NavigationContainer>   
    </GlobalProvider>
  ); 
}
 
