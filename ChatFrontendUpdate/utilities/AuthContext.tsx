import { createContext, useContext, useState, useEffect } from 'react';
import { initializeToken, token as storedToken, clearToken } from '@/utilities/Config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInitialized, setTokenInitialized] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      try {
        await initializeToken();
        setTokenInitialized(true);
        setIsAuthenticated(!!storedToken);

      } catch (error) {
        console.error("Error loading token:", error);
      }
    };

    loadToken();
  }, [storedToken,tokenInitialized,isAuthenticated]);

  const logout = () => {
    clearToken(); 
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, tokenInitialized, logout,setIsAuthenticated,setTokenInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
