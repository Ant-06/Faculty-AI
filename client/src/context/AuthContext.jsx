import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("fah_user");

      if (!stored) {
        return null;
      }

      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to read stored user:", error);

      localStorage.removeItem("fah_user");
      localStorage.removeItem("fah_token");

      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  /*
   * Store authentication information
   */
  const persist = useCallback((token, userData) => {
    localStorage.setItem("fah_token", token);
    localStorage.setItem("fah_user", JSON.stringify(userData));

    setUser(userData);
  }, []);

  /*
   * LOGIN
   *
   * api base URL:
   * https://faculty-ai-wpj0.onrender.com/api
   *
   * endpoint:
   * /auth/login
   *
   * final request:
   * https://faculty-ai-wpj0.onrender.com/api/auth/login
   */
  const login = useCallback(
    async (email, password) => {
      setLoading(true);

      try {
        const res = await api.post("/auth/login", {
          email: email.trim(),
          password,
        });

        if (!res.data?.token || !res.data?.user) {
          throw new Error("Invalid login response from server.");
        }

        persist(res.data.token, res.data.user);

        return res.data.user;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  /*
   * REGISTER
   *
   * final request:
   * https://faculty-ai-wpj0.onrender.com/api/auth/register
   */
  const register = useCallback(
    async (name, email, password) => {
      setLoading(true);

      try {
        const res = await api.post("/auth/register", {
          name: name.trim(),
          email: email.trim(),
          password,
        });

        if (!res.data?.token || !res.data?.user) {
          throw new Error("Invalid registration response from server.");
        }

        persist(res.data.token, res.data.user);

        return res.data.user;
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  /*
   * LOGOUT
   */
  const logout = useCallback(() => {
    localStorage.removeItem("fah_token");
    localStorage.removeItem("fah_user");

    setUser(null);
  }, []);

  /*
   * REFRESH PROFILE
   */
  const refreshProfile = useCallback(async () => {
    try {
      const res = await api.get("/profile");

      setUser((previousUser) => {
        const mergedUser = {
          ...previousUser,
          profile: res.data.profile,
          name: res.data.name,
        };

        localStorage.setItem(
          "fah_user",
          JSON.stringify(mergedUser)
        );

        return mergedUser;
      });

      return res.data;
    } catch (error) {
      console.error("Profile refresh error:", error);

      return null;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}