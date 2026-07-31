"use client";

import { FormEvent } from "react";
import { SearchAlbum } from "../types";
import { AlbumCard } from "./AlbumCard";

interface DiscoverProps {
  query: string;
  setQuery: (value: string) => void;
  submit: (event: FormEvent) => void;
  searching: boolean;
  results: SearchAlbum[];
  choose: (album: SearchAlbum) => void;
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
          placeholder="Search artists, albums, or a feeling…"
        />
        <button className="button primary" disabled={searching}>
          {searching ? "Searching…" : "Search"}
        </button>
      </form>
      {!results.length && !searching && (
        <div className="discover-hint">
          <span>✦</span>
          <p>
            Try{" "}
            <button type="button" onClick={() => setQuery("Khruangbin")}>
              Khruangbin
            </button>
            ,{" "}
            <button type="button" onClick={() => setQuery("Nina Simone")}>
              Nina Simone
            </button>
            , or{" "}
            <button type="button" onClick={() => setQuery("Radiohead")}>
              Radiohead
            </button>
            .
          </p>
        </div>
      )}
      <div className="album-grid">
        {results.map((album) => (
          <AlbumCard
            key={album.appleCatalogId}
            album={album}
            action={() => choose(album)}
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
