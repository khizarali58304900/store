
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'

const AppWithLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // The LoadingScreen component has its own timer, but we'll set this state
    // to false after it's done to ensure proper cleanup
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {isLoading && <LoadingScreen />}
      <App />
    </>
  );
};

createRoot(document.getElementById("root")!).render(<AppWithLoader />);
