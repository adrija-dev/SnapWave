import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const API_URL = "https://snapwave-bha7.onrender.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get saved user when app starts
  useEffect(() => {
    const token = localStorage.getItem("snapwave_token");
    const savedUser = localStorage.getItem("snapwave_user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // Login
  const login = async (emailOrUsername, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailOrUsername,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("snapwave_token", data.token);
    localStorage.setItem("snapwave_user", JSON.stringify(data.user));

    setUser(data.user);

    return data;
  };

  // Register
  const register = async (username, email, password) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("snapwave_token");
    localStorage.removeItem("snapwave_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);