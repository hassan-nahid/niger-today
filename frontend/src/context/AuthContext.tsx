import React, { createContext, useEffect, useState, useCallback } from "react";
import type {
  User,
  LoginPayload,
  UpdateProfilePayload,
  AuthResult,
  ProfileResult,
} from "../api/auth.api";
import {
  loginApi,
  getProfileApi,
  logoutApi,
  updateProfileApi,
} from "../api/auth.api";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginPayload) => Promise<void>;
  updateProfile: (data: UpdateProfilePayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("access_token");
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and verify existing token with backend
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        try {
          const res = await getProfileApi();
          const profileData = res.data?.attributes || res.data;
          const currentUser = (profileData && "user" in (profileData as ProfileResult))
            ? (profileData as ProfileResult).user
            : (profileData as User);

          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem("user", JSON.stringify(currentUser));
          }
        } catch {
          // If token is invalid or expired, clear it
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginPayload) => {
    const response = await loginApi(data);
    const authData = (response.data?.attributes || response.data) as AuthResult;
    const { user: loggedInUser, tokens } = authData;

    if (tokens?.access?.token) {
      localStorage.setItem("access_token", tokens.access.token);
      localStorage.setItem("refresh_token", tokens.refresh?.token || "");
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      setToken(tokens.access.token);
      setUser(loggedInUser);
    }
  };

  const updateProfile = async (data: UpdateProfilePayload) => {
    try {
      const res = await updateProfileApi(data);
      const updatedUser = (res.data?.attributes || res.data) as User;
      if (updatedUser && updatedUser.id) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setUser((prev) => {
          const merged = { ...prev, ...data } as User;
          localStorage.setItem("user", JSON.stringify(merged));
          return merged;
        });
      }
    } catch (err) {
      // In case of offline/network issues, persist update locally for smooth UX
      setUser((prev) => {
        const merged = { ...prev, ...data } as User;
        localStorage.setItem("user", JSON.stringify(merged));
        return merged;
      });
      throw err;
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch {
      // Continue client cleanup even if backend logout fails
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
    }
  };

  const refreshProfile = useCallback(async () => {
    try {
      const res = await getProfileApi();
      const profileData = res.data?.attributes || res.data;
      const currentUser = (profileData && "user" in (profileData as ProfileResult))
        ? (profileData as ProfileResult).user
        : (profileData as User);

      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      }
    } catch {
      // Silent error
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        updateProfile,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
