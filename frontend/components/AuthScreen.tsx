"use client";

import { FormEvent } from "react";
import { AuthMode } from "../types";
import { RecordIcon } from "./RecordIcon";

interface AuthScreenProps {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  submit: (e: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  notice: { message: string; type: "success" | "error" } | null;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function AuthScreen({
  mode,
  setMode,
  submit,
  loading,
  notice,
  darkMode,
  toggleDarkMode,
}: AuthScreenProps) {
  return (
    <main className="auth-page">
      <section className="auth-story">
        <div className="brand">
          <RecordIcon className="logo-spin" />
          <span>MusicLocker</span>
        </div>
        <div className="auth-copy">
          <p className="eyebrow">A PERSONAL MUSIC JOURNAL</p>
          <h1>
            Every great
            <br />
            <em>collection</em> has a story.
          </h1>
          <p>
            Search the world’s music, save the albums that move you, and see
            your taste take shape.
          </p>
        </div>
        <div className="floating-cards">
          <div className="mini-disc one" />
          <div className="mini-disc two" />
          <div className="quote">
            “A home for your
            <br />
            favourite sounds.”
          </div>
        </div>
      </section>
      <section className="auth-panel">
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
        >
          {darkMode ? "☀ Light" : "☾ Dark"}
        </button>
        <div className="auth-form-wrap">
          <p className="eyebrow">WELCOME {mode === "register" ? "IN" : "BACK"}</p>
          <h2>
            {mode === "register"
              ? "Start your collection."
              : "Pick up where you left off."}
          </h2>
          <p className="muted">
            {mode === "register"
              ? "It takes less than a minute."
              : "Your listening story is waiting."}
          </p>
          {notice && <div className={`notice ${notice.type}`}>{notice.message}</div>}
          <form onSubmit={submit} className="auth-form">
            <label>
              Username
              <input
                name="username"
                required
                minLength={3}
                maxLength={50}
                placeholder="e.g. midnightlistener"
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
              />
            </label>
            <button className="button primary wide" disabled={loading}>
              {loading
                ? "Just a moment…"
                : mode === "register"
                ? "Create my room"
                : "Sign in"}
              <span>→</span>
            </button>
          </form>
          <p className="switcher">
            {mode === "register" ? "Already collecting?" : "New around here?"}{" "}
            <button
              onClick={() => setMode(mode === "register" ? "login" : "register")}
            >
              {mode === "register" ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
