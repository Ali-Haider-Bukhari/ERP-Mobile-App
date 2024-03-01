import { GlobalProvider } from './contexts/GlobalContext';
import Navigation from './components/Navigation.js';
import { AuthProvider } from './contexts/AuthContext.js';

export default function App() {
  return (
    <GlobalProvider>
        <AuthProvider>
           <Navigation/>
        </AuthProvider>
    </GlobalProvider>
  ); 
}
 
