import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

interface User {
  email: string;
  role: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("authToken");
  });

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token]);

  const fetchUserDetails = async (token: string) => {
    try {
      const fetchUrl = `${import.meta.env.VITE_API_URL}/api/auth/user-details`
      const response = await axios.get(fetchUrl, {
        params: { token },
      });
      setUser(response.data);
      console.log("User details:", response.data);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      logout();
    }
  };

  const login = async (newToken: string) => {
    setToken(newToken);

    await fetchUserDetails(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};



const EXPIRATION_TIME = 23 * 60 * 60 * 1000;
// const EXPIRATION_TIME = 10  * 1000;

const checkTokenOnStartup = (logout: ()=>void) => {
  const loginTime = localStorage.getItem("login_time");
  if (!loginTime) return; // No login time, assume fresh login

  const elapsedTime = Date.now() - parseInt(loginTime, 10);
  if (elapsedTime > EXPIRATION_TIME) {
    console.log("Token expired. Clearing storage...");
    logout();
    localStorage.removeItem("login_time");
    window.location.href = "/login"; // Redirect to login
  }
};

export const useTokenCleanupOnStartup = () => {
  const { logout } = useAuth();
  useEffect(() => {
    checkTokenOnStartup(logout); // Run check when the app loads
  }, []);
};