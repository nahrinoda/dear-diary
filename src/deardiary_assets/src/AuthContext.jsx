import { createContext, useContext } from 'react';

// Provides { identity, principal, agent } to the component tree.
// Populated in index.jsx after successful Internet Identity authentication.
export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);
