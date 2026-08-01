"use client";

import { FormEvent, useEffect, useState } from "react";
import { SearchSong } from "../types";
import { SongCard } from "./SongCard";

interface DiscoverProps {
  query: string;
  setQuery: (value: string) => void;
  submit: (event: FormEvent) => void;
  searching: boolean;
  results: SearchSong[];
  choose: (song: SearchSong) => void;
  page: number;
  onPageChange: (nextPage: number) => void;
}

export function Discover({
  query,
  setQuery,
  submit,
  searching,
  results,
  choose,
  page,
  onPageChange,
}: DiscoverProps) {
  const [hint, setHint] = useState("Search for a song or artist to get started.");

  useEffect(() => {
    const prompts = [
      "What do you feel like listening to today?",
      "Let's discover your new on repeat.",
      "What is the soundtrack to your current mood?",
      "Dig into the crates. What sounds are you chasing?",
      "Search a genre, a year, or an artist that moves you.",
      "Let's find some songs to lock into your library.",
      "Ready to explore? Search for a classic or a new favorite."
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setHint(randomPrompt);
  }, []);
  return (
    <section className="content fade-in">
      <div className="section-title">
        <div>
          <p className="eyebrow">EXPLORE THE CATALOG</p>
          <h2>Find your next favourite.</h2>
        </div>
      </div>
      <form className="search-box" onSubmit={submit}>
        <span>⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artists, songs, or a feeling…"
        />
        <button className="button primary" disabled={searching}>
          {searching ? "Searching…" : "Search"}
        </button>
      </form>
      {!results.length && !searching && (
        <div className="discover-hint">
          <span>✦</span>
          <p>{hint}</p>
        </div>
      )}
      <div className="album-grid">
        {results.map((song) => (
          <SongCard
            key={song.appleCatalogId}
            song={song}
            action={() => choose(song)}
            actionLabel="Save to library"
          />
        ))}
      </div>

      {results.length > 0 && (
        <div
          className="pagination-bar"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.5rem",
            marginTop: "2.5rem",
            padding: "1.5rem 0",
            borderTop: "1px solid var(--line)",
          }}
        >
          <button
            className="button ghost"
            disabled={page === 0 || searching}
            onClick={() => onPageChange(page - 1)}
            style={{ opacity: page === 0 ? 0.4 : 1 }}
          >
            ← Previous
          </button>
          <span
            className="mono"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}
          >
            Page {page + 1}
          </span>
          <button
            className="button ghost"
            disabled={results.length < 12 || searching}
            onClick={() => onPageChange(page + 1)}
            style={{ opacity: results.length < 12 ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}
