"use client";

import { clearToken, getSession } from "@/utils/queries";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  setUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const logout = async () => {
    await clearToken();

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const setUser = (user: User) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      isLoading: false,
      user,
    }));
  };

  const {} = useQuery({
    queryKey: ["fetch-user"],
    queryFn: async () => {
      try {
        const res = await getSession();

        if (res.success) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isAuthenticated: true,
            user: res.user_data,
          }));
        } else setState((prev) => ({ ...prev, isLoading: false }));

        return res.user_data;
      } catch (error) {
        console.error("Auth initialization error:", error);
        await logout();
        return null;
      }
    },
  });

  return (
    <AuthContext.Provider value={{ ...state, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
