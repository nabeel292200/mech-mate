import { create } from 'zustand';
import { api } from '../services/api.service';
import { IUser, AuthResponse } from '../types';

interface AuthState {
  user: IUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<AuthResponse["data"]>;
  register: (phone: string, password: string, role: "user" | "mechanic") => Promise<AuthResponse["data"]>;
  logout: () => void;
  updateProfile: (profileData: Partial<IUser> & any) => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  checkSession: async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("assist_token");

    if (!token) {
      set({ user: null, isAuthenticated: false, loading: false });
      return;
    }

    try {
      const data = await api.get<{ success: boolean; data: { user: IUser } }>("auth/me");
      if (data.success && data.data.user) {
        set({ user: data.data.user, isAuthenticated: true });
      } else {
        get().logout();
      }
    } catch (error) {
      console.error("[AUTH] Session restoration failed:", error);
      get().logout();
    } finally {
      set({ loading: false });
    }
  },

  login: async (phone: string, password: string) => {
    const res = await api.post<AuthResponse>("auth/login", { phone, password });
    localStorage.setItem("assist_token", res.data.token);
    localStorage.setItem("assist_role", res.data.role);
    set({ user: res.data.user, isAuthenticated: true });
    return res.data;
  },

  register: async (phone: string, password: string, role: "user" | "mechanic") => {
    const res = await api.post<AuthResponse>("auth/register", { phone, password, role });
    localStorage.setItem("assist_token", res.data.token);
    localStorage.setItem("assist_role", res.data.role);
    set({ user: res.data.user, isAuthenticated: true });
    return res.data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("assist_token");
      localStorage.removeItem("assist_role");
      window.location.href = "/";
    }
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (profileData: any) => {
    const res = await api.put<{ success: boolean; data: { user: IUser } }>("auth/profile", profileData);
    if (res.success && res.data.user) {
      set({ user: res.data.user });
    }
  },
}));
