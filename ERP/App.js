import { GlobalProvider } from './contexts/GlobalContext';
import Navigation from './components/Navigation.js';
export default function App() {
  return (
    <GlobalProvider>
      <Navigation/>
    </GlobalProvider>
  ); 
}
 
