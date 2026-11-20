import React, { createContext, useContext, useReducer } from 'react';

export const ROLES = ['admin', 'dokter', 'pasien'];

const initialState = { user: null };
const AuthContext = createContext(undefined);

export function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      const payload = action.payload;
      if (!payload || !ROLES.includes(payload.role)) return state;
      return { user: { nama: payload.nama, role: payload.role } };
    }
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (nama, role) => {
    dispatch({ type: 'LOGIN', payload: { nama, role } });
  };
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider.');
  }
  return context;
}
