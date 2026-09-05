import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import configuration from "../utils/configuration.js";

const AuthContext = createContext(null);
let refreshpromise = null;
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(username, password) {
    const response = await fetch(`${configuration.API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    setUser(data.user);
    setAccessToken(data.accessToken);
    return data;
  }

  async function register(name, username, password) {
    const response = await fetch(`${configuration.API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || "Registration failed");
      error.errors = data.errors || [];
      throw error;
    }

    setUser(data.user);
    setAccessToken(data.accessToken);

    return data;
  }

  const refreshAccessToken = useCallback(async () => {
    if (refreshpromise) {
      return refreshpromise;
    }

    refreshpromise = fetch(`${configuration.API_URL}/api/auth/refresh-token`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to refresh access token");
        }
        setAccessToken(data.accessToken);
        return data.accessToken;
      })
      .finally(() => {
        refreshpromise = null;
      });

    return refreshpromise;
  }, []);

  useEffect(() => {
    async function restoreAuth() {
      try {
        const token = await refreshAccessToken();
        const response = await fetch(
          `${configuration.API_URL}/api/auth/get-me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to get user data");
        }
        setUser(data.user);
      } catch (error) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    }
    restoreAuth();
  }, [refreshAccessToken]);

  async function logout() {
    const response = await fetch(`${configuration.API_URL}/api/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to logout");
    }
    setUser(null);
    setAccessToken(null);
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        refreshAccessToken,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
