"use client";

import { Album } from "../types";
import { LibraryCard } from "./LibraryCard";

interface LibraryProps {
  albums: Album[];
  onDiscover: () => void;
  onUpdate: (album: Album, patch: Partial<Album>) => void;
  onRemove: (album: Album) => void;
}

export function Library({
  albums,
  onDiscover,
  onUpdate,
  onRemove,
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
      )}
    </section>
  );
}
