"use client";

import { Song } from "../types";
import { LibraryCard } from "./LibraryCard";

interface LibraryProps {
  songs: Song[];
  onDiscover: () => void;
  onUpdate: (song: Song, patch: Partial<Song>) => void;
  onRemove: (song: Song) => void;
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}

export function Library({
  songs,
  onDiscover,
  onUpdate,
  onRemove,
  page,
  totalPages,
  onPageChange,
}: LibraryProps) {
  return (
    <section className="content fade-in">
      <div className="section-title">
        <div>
          <p className="eyebrow">YOUR SHELVES</p>
          <h2>The songs that stay.</h2>
        </div>
        <button className="button primary" onClick={onDiscover}>
          Add a song <span>+</span>
        </button>
      </div>
      {songs.length === 0 ? (
        <div className="empty-state compact">
          <div className="empty-art">▤</div>
          <h2>No songs on the shelf yet.</h2>
          <p>Discover a track and make this space yours.</p>
          <button className="button primary" onClick={onDiscover}>
            Explore the catalog
          </button>
        </div>
      ) : (
        <>
          <div className="album-grid library-grid">
            {songs.map((song) => (
              <LibraryCard
                key={song.id}
                song={song}
                update={onUpdate}
                remove={onRemove}
              />
            ))}
          </div>
          {totalPages > 1 && (
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
                disabled={page === 0}
                onClick={() => onPageChange(page - 1)}
                style={{ opacity: page === 0 ? 0.4 : 1 }}
              >
                ← Previous
              </button>
              <span
                className="mono"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}
              >
                {page + 1} / {totalPages}
              </span>
              <button
                className="button ghost"
                disabled={page === totalPages - 1}
                onClick={() => onPageChange(page + 1)}
                style={{ opacity: page === totalPages - 1 ? 0.4 : 1 }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
