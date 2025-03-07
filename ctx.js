import { useContext, createContext } from 'react';
import { useStorageState } from './useStorageState';

const AuthContext = createContext({
  signIn: (email, password) => null, // Acepta email y password
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
    // Credenciales de prueba
    const testEmail = 'usuario@ejemplo.com';
    const testPassword = 'password123';

    if (email === testEmail && password === testPassword) {
      // Simulación de un token de sesión
      const fakeSessionToken = 'fake-session-token';
      setSession(fakeSessionToken); // Establece la sesión
      return true; // Indica que el inicio de sesión fue exitoso
    } else {
      return false; // Indica que el inicio de sesión falló
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: () => {
          setSession(null); // Limpia la sesión al cerrar sesión
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}