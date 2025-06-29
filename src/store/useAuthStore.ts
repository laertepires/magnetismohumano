import { create } from "zustand";

interface AuthData {
  token: string;
  username: string;
}

interface AuthState {
  isLogged: boolean;
  username: string | null;
  login: (data: AuthData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLogged: !!localStorage?.getItem("token"),
  username: localStorage?.getItem("username") ?? null,
  login: (data: AuthData) =>
    set(() => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      return { isLogged: true, data: data.username };
    }),
  logout: () =>
    set(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      return { isLogged: false, username: null };
    }),
}));
