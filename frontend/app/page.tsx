"use client";

import { useEffect, useState } from "react";
import { Tab, Song } from "../types";
import { AuthScreen } from "../components/AuthScreen";
import { Overview } from "../components/Overview";
import { Discover } from "../components/Discover";
import { Library } from "../components/Library";
import { SaveDialog } from "../components/SaveDialog";
import { TabButton } from "../components/TabButton";
import { RecordIcon } from "../components/RecordIcon";
import { useNotice } from "../hooks/useNotice";
import { useAuth } from "../hooks/useAuth";
import { useSearch } from "../hooks/useSearch";
import { useLibrary } from "../hooks/useLibrary";

export default function Home() {
  const [tab, setTab] = useState<Tab>("overview");
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);

  // Hook 1: Notice Banner
  const { notice, setNotice } = useNotice();

  // Hook 2: Authentication & Theme
  const {
    token,
    username,
    authMode,
    setAuthMode,
    darkMode,
    toggleDarkMode,
    loading: authLoading,
    logout,
    authenticate,
  } = useAuth({
    setNotice,
  });

  // Hook 3: iTunes Search
  const {
    search,
    setSearch,
    debouncedSearch,
    setDebouncedSearch,
    results,
    searching,
    searchPage,
    executeSearchQuery,
    runSearch,
  } = useSearch({
    token,
    logout,
    setNotice,
  });

  // Hook 4: User Library, Analytics & Curation
  const {
    songs,
    libraryPage,
    totalPages,
    totalElements,
    analytics,
    curation,
    generatingCuration,
    loading: libraryLoading,
    selected,
    setSelected,
    rating,
    setRating,
    notes,
    setNotes,
    clearLibraryState,
    refresh,
    generateCuration,
    saveSelected,
    updateSong,
    removeSong,
  } = useLibrary({
    token,
    logout,
    setNotice,
    setTab,
  });

  const loading = authLoading || libraryLoading;

  // React to token changes (loading library or clearing states)
  useEffect(() => {
    if (!token) {
      clearLibraryState();
    } else {
      void refresh(token);
    }
  }, [token]);

  // React to slow api requests (due to Render cold start)
  useEffect(() => {
    const handleSlowRequest = () => {
      setNotice(
        "Note: The server is taking longer than usual to respond. Since it is deployed on Render's free tier, the first request can take up to a minute due to cold starts. Thank you for your patience!",
        "success",
        15000
      );
    };

    window.addEventListener("api-slow-request", handleSlowRequest);
    return () => {
      window.removeEventListener("api-slow-request", handleSlowRequest);
    };
  }, [setNotice]);

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
          <RecordIcon className="logo-spin" />
          <span>MusicLocker</span>
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
          label={`Library ${totalElements ? `(${totalElements})` : ""}`}
          icon="▤"
        />
      </nav>
      {notice && (
        <div className={`notice ${notice.type}`} role="status">
          {notice.message}
          <button onClick={() => setNotice("")}>×</button>
        </div>
      )}
      {loading && <div className="loading-line" />}
      {tab === "overview" && (
        <Overview
          analytics={analytics}
          onDiscover={() => setTab("discover")}
          curation={curation}
          generatingCuration={generatingCuration}
          onGenerateCuration={generateCuration}
          onQuickSearch={(queryText) => {
            setSearch(queryText);
            setDebouncedSearch(queryText);
            setTab("discover");
            void executeSearchQuery(queryText, 0);
          }}
        />
      )}
      {tab === "discover" && (
        <Discover
          query={search}
          setQuery={setSearch}
          submit={runSearch}
          searching={searching}
          results={results}
          choose={(song) => {
            setSelected(song);
            setRating(4);
            setNotes("");
          }}
          page={searchPage}
          onPageChange={(nextPage) => {
            void executeSearchQuery(debouncedSearch || search, nextPage);
          }}
        />
      )}
      {tab === "library" && (
        <Library
          songs={songs}
          onDiscover={() => setTab("discover")}
          onUpdate={updateSong}
          onRemove={(song) => setSongToDelete(song)}
          page={libraryPage}
          totalPages={totalPages}
          onPageChange={(nextPage) => {
            void refresh(token, nextPage);
          }}
        />
      )}
      {selected && (
        <SaveDialog
          song={selected}
          rating={rating}
          setRating={setRating}
          notes={notes}
          setNotes={setNotes}
          close={() => setSelected(null)}
          submit={saveSelected}
        />
      )}
      {songToDelete && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="save-dialog">
            <button className="close" type="button" onClick={() => setSongToDelete(null)}>
              ×
            </button>
            <p className="eyebrow">REMOVE FROM SHELF</p>
            <h2>Are you sure?</h2>
            <p className="muted" style={{ margin: "10px 0 24px" }}>
              Do you want to remove <strong>“{songToDelete.title}”</strong> by <strong>{songToDelete.artistName}</strong> from your library? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                className="button danger wide"
                onClick={async () => {
                  const target = songToDelete;
                  setSongToDelete(null);
                  await removeSong(target);
                }}
              >
                Remove song <span>→</span>
              </button>
              <button
                type="button"
                className="button ghost wide"
                onClick={() => setSongToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
