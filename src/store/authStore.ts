import { create } from "zustand";
import type { User } from "../types/auth.types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  updateToken: (accessToken: string) => void;
  logout: () => void;
};

const SESSION_KEY = "agrivision_user";

function readPersistedUser(): User | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

const persistedUser = readPersistedUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: persistedUser,
  accessToken: null,
  isAuthenticated: !!persistedUser,
  setAuth: (user, accessToken) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    set({ user, accessToken, isAuthenticated: true });
  },
  updateToken: (accessToken) => set({ accessToken }),
  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
