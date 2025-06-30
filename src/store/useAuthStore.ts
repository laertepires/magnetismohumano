"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthData {
  token: string;
  user: {
    username: string;
  };
}

interface AuthState {
  isLogged: boolean;
  token: string | null;
  username: string | null;
  login: (data: AuthData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLogged: false,
      token: null,
      username: null,

      login: (data: AuthData) =>
        set(() => ({
          isLogged: true,
          token: data.token,
          username: data.user.username,
        })),

      logout: () =>
        set(() => ({
          isLogged: false,
          token: null,
          username: null,
        })),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isLogged: state.isLogged,
        token: state.token,
        username: state.username,
      }),
    }
  )
);
