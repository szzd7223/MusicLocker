import { useState, useEffect, FormEvent } from "react";
import { AuthMode } from "../types";
import { apiRequest } from "../utils/api";

interface UseAuthOptions {
  setNotice: (msg: string, type?: "success" | "error") => void;
  onLogout?: () => void;
}

export function useAuth({ setNotice, onLogout }: UseAuthOptions) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("music-locker-token");
    const storedName = window.localStorage.getItem("music-locker-username");
    if (stored) {
      setToken(stored);
      setUsername(storedName ?? "Listener");
    }

    const storedDark = window.localStorage.getItem("music-locker-dark-mode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = storedDark ? storedDark === "true" : prefersDark;
    setDarkMode(initialDark);
    if (initialDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  function toggleDarkMode() {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    window.localStorage.setItem("music-locker-dark-mode", String(nextDark));
    if (nextDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }

  function logout() {
    window.localStorage.removeItem("music-locker-token");
    window.localStorage.removeItem("music-locker-username");
    setToken(null);
    setNotice("Signed out safely.");
    if (onLogout) {
      onLogout();
    }
  }

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const nextUsername = String(form.get("username") ?? "");
    try {
      const payload = (await apiRequest(
        `/api/auth/${authMode}`,
        {
          method: "POST",
          body: JSON.stringify({ username: nextUsername, password: form.get("password") }),
        },
        null,
        logout
      )) as { token: string };
      window.localStorage.setItem("music-locker-token", payload.token);
      window.localStorage.setItem("music-locker-username", nextUsername);
      setUsername(nextUsername);
      setToken(payload.token);
      setNotice(authMode === "register" ? "Your MusicLocker is ready." : "Welcome back.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not authenticate.", "error");
    } finally {
      setLoading(false);
    }
  }

  return {
    token,
    setToken,
    username,
    setUsername,
    authMode,
    setAuthMode,
    darkMode,
    toggleDarkMode,
    loading,
    setLoading,
    logout,
    authenticate,
  };
}
