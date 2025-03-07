import { useContext, createContext } from 'react';
import { useStorageState } from './useStorageState';

const AuthContext = createContext({
  signIn: (email, password) => null, 
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }) {
  const [[isLoading, session], setSession] = useStorageState('session');

  const signIn = (email, password) => {
    const testEmail = 'usuario@ejemplo.com';
    const testPassword = 'password123';

    if (email === testEmail && password === testPassword) {
      const fakeSessionToken = 'fake-session-token';
      setSession(fakeSessionToken); 
      return true; 
    } else {
      return false; 
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: () => {
          setSession(null); 
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
