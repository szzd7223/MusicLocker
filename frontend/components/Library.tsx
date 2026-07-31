"use client";

import { Album } from "../types";
import { LibraryCard } from "./LibraryCard";

interface LibraryProps {
  albums: Album[];
  onDiscover: () => void;
  onUpdate: (album: Album, patch: Partial<Album>) => void;
  onRemove: (album: Album) => void;
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}

export function Library({
  albums,
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
          <h2>The albums that stay.</h2>
        </div>
        <button className="button primary" onClick={onDiscover}>
          Add an album <span>+</span>
        </button>
      </div>
      {albums.length === 0 ? (
        <div className="empty-state compact">
          <div className="empty-art">▤</div>
          <h2>No albums on the shelf yet.</h2>
          <p>Discover a record and make this space yours.</p>
          <button className="button primary" onClick={onDiscover}>
            Explore the catalog
          </button>
        </div>
      ) : (
        <>
          <div className="album-grid library-grid">
            {albums.map((album) => (
              <LibraryCard
                key={album.id}
                album={album}
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
