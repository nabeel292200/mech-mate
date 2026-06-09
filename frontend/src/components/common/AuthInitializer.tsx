"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

export function AuthInitializer() {
  const { checkSession, logout } = useAuthStore();

  useEffect(() => {
    checkSession();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "assist_token") {
        if (!e.newValue) {
          logout();
        } else {
          checkSession();
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [checkSession, logout]);

  return null;
}
