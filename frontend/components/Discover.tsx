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
}

export function Discover({
  query,
  setQuery,
  submit,
  searching,
  results,
  choose,
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
    </section>
  );
}
