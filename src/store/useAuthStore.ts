import { create } from "zustand";

interface AuthState {
  isLogged: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLogged: !!localStorage?.getItem("token"),
  username: localStorage?.getItem("username") ?? null,
  login: (username) =>
    set(() => {
      localStorage.setItem("token", "1");
      localStorage.setItem("username", username);
      return { isLogged: true, username };
    }),
  logout: () =>
    set(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      return { isLogged: false, username: null };
    }),
}));
