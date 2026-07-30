"use client";

import { FormEvent, useEffect, useState } from "react";
import { Album, Analytics, SearchAlbum, Tab } from "../types";
import { API, apiError } from "../utils/api";
import { AuthScreen } from "../components/AuthScreen";
import { Overview } from "../components/Overview";
import { Discover } from "../components/Discover";
import { Library } from "../components/Library";
import { SaveDialog } from "../components/SaveDialog";
import { TabButton } from "../components/TabButton";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchAlbum[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<SearchAlbum | null>(null);
  const [rating, setRating] = useState(4);
  const [notes, setNotes] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("record-room-token");
    const storedName = window.localStorage.getItem("record-room-username");
    if (stored) {
      setToken(stored);
      setUsername(storedName ?? "Listener");
    }

    const storedDark = window.localStorage.getItem("record-room-dark-mode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = storedDark ? storedDark === "true" : prefersDark;
    setDarkMode(initialDark);
    if (initialDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (token) void refresh(token);
  }, [token]);

  function toggleDarkMode() {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    window.localStorage.setItem("record-room-dark-mode", String(nextDark));
    if (nextDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }

  async function request(path: string, options: RequestInit = {}, accessToken = token) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    });
    if (response.status === 401) {
      logout();
      throw new Error("Session expired. Please sign in again.");
    }
    const payload = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(apiError(payload, `Request failed (${response.status})`));
    }
    return payload;
  }

  async function refresh(accessToken = token) {
    if (!accessToken) return;
    setLoading(true);
    try {
      const [library, insight] = await Promise.all([
        request("/api/library", {}, accessToken) as Promise<Album[]>,
        request("/api/analytics", {}, accessToken) as Promise<Analytics>,
      ]);
      setAlbums(library);
      setAnalytics(insight);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load your library.");
    } finally {
      setLoading(false);
    }
  }

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const nextUsername = String(form.get("username") ?? "");
    try {
      const payload = (await request(
        `/api/auth/${authMode}`,
        {
          method: "POST",
          body: JSON.stringify({ username: nextUsername, password: form.get("password") }),
        },
        null
      )) as { token: string };
      window.localStorage.setItem("record-room-token", payload.token);
      window.localStorage.setItem("record-room-username", nextUsername);
      setUsername(nextUsername);
      setToken(payload.token);
      setNotice(authMode === "register" ? "Your record room is ready." : "Welcome back.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not authenticate.");
    } finally {
      setLoading(false);
    }
  }

  async function runSearch(event: FormEvent) {
    event.preventDefault();
    if (!search.trim()) return;
    setSearching(true);
    setNotice("");
    try {
      setResults(
        (await request(
          `/api/search?query=${encodeURIComponent(search.trim())}&type=album`,
          {},
          null
        )) as SearchAlbum[]
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Search failed.");
    } finally {
      setSearching(false);
    }
  }

  async function saveSelected(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setLoading(true);
    try {
      await request("/api/library", {
        method: "POST",
        body: JSON.stringify({ ...selected, userRating: rating, userNotes: notes }),
      });
      setSelected(null);
      setNotes("");
      setNotice(`Saved ${selected.title} to your library.`);
      await refresh();
      setTab("library");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save this album.");
    } finally {
      setLoading(false);
    }
  }

  async function updateAlbum(album: Album, patch: Partial<Album>) {
    setLoading(true);
    try {
      await request(`/api/library/${album.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...album, ...patch }),
      });
      setNotice("Album details updated.");
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not update album.");
    } finally {
      setLoading(false);
    }
  }

  async function removeAlbum(album: Album) {
    if (!window.confirm(`Remove “${album.title}” from your library?`)) return;
    setLoading(true);
    try {
      await request(`/api/library/${album.id}`, { method: "DELETE" });
      setNotice("Album removed.");
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not remove album.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    window.localStorage.removeItem("record-room-token");
    window.localStorage.removeItem("record-room-username");
    setToken(null);
    setAlbums([]);
    setAnalytics(null);
    setNotice("Signed out safely.");
  }

  if (!token) {
    return (
      <AuthScreen
        mode={authMode}
        setMode={setAuthMode}
        submit={authenticate}
        loading={loading}
        notice={notice}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setTab("overview")}>
          <span className="brand-mark">R</span>
          <span>record room</span>
        </button>
        <div className="topbar-actions">
          <span className="listener">Hi, {username}</span>
          <button className="theme-toggle" onClick={toggleDarkMode} aria-label="Toggle theme">
            {darkMode ? "☀" : "☾"}
          </button>
          <button className="button ghost" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>
      <section className="dashboard-head">
        <div>
          <p className="eyebrow">YOUR MUSIC, IN FOCUS</p>
          <h1>Good to see you, {username}.</h1>
          <p>Build a library that sounds like you, then discover the patterns inside it.</p>
        </div>
        <div className="head-orb">♫</div>
      </section>
      <nav className="tabs" aria-label="Main navigation">
        <TabButton active={tab === "overview"} onClick={() => setTab("overview")} label="Overview" icon="◌" />
        <TabButton active={tab === "discover"} onClick={() => setTab("discover")} label="Discover" icon="⌕" />
        <TabButton
          active={tab === "library"}
          onClick={() => setTab("library")}
          label={`Library ${albums.length ? `(${albums.length})` : ""}`}
          icon="▤"
        />
      </nav>
      {notice && (
        <div className="notice" role="status">
          {notice}
          <button onClick={() => setNotice("")}>×</button>
        </div>
      )}
      {loading && <div className="loading-line" />}
      {tab === "overview" && <Overview analytics={analytics} onDiscover={() => setTab("discover")} />}
      {tab === "discover" && (
        <Discover
          query={search}
          setQuery={setSearch}
          submit={runSearch}
          searching={searching}
          results={results}
          choose={(album) => {
            setSelected(album);
            setRating(4);
            setNotes("");
          }}
        />
      )}
      {tab === "library" && (
        <Library
          albums={albums}
          onDiscover={() => setTab("discover")}
          onUpdate={updateAlbum}
          onRemove={removeAlbum}
        />
      )}
      {selected && (
        <SaveDialog
          album={selected}
          rating={rating}
          setRating={setRating}
          notes={notes}
          setNotes={setNotes}
          close={() => setSelected(null)}
          submit={saveSelected}
        />
      )}
    </main>
  );
}
