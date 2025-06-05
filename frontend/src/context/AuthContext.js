import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  
  // Vérifie si un token existe au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // On décode le token pour retrouver les infos utilisateur
    try {
      const payload = jwtDecode(token);
      // payload doit contenir userId, email, role, etc. selon comment tu crées ton JWT côté back
      setUser({
        email: payload.email,
        role: payload.role,
        nom: payload.nom,
        _id: payload.userId,
        token,
      });
    } catch (e) {
      setUser(null);
    }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


