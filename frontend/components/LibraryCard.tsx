"use client";

import { useState } from "react";
import { Album } from "../types";
import { AlbumCard } from "./AlbumCard";

interface LibraryCardProps {
  album: Album;
  update: (album: Album, patch: Partial<Album>) => void;
  remove: (album: Album) => void;
}

export function LibraryCard({ album, update, remove }: LibraryCardProps) {
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(album.userRating ?? 3);
  const [notes, setNotes] = useState(album.userNotes ?? "");

  return (
    <article className="library-card">
      <AlbumCard
        album={album}
        action={() => setEditing(!editing)}
        actionLabel={editing ? "Close editor" : "Edit details"}
      />
      {editing && (
        <form
          className="inline-editor"
          onSubmit={(e) => {
            e.preventDefault();
            update(album, { userRating: rating, userNotes: notes });
            setEditing(false);
          }}
        >
          <label>
            Rating{" "}
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} stars
                </option>
              ))}
            </select>
          </label>
          <label>
            Personal note
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={4000}
              placeholder="Why does this album matter to you?"
            />
          </label>
          <div>
            <button className="button small primary">Save</button>
            <button
              className="button small danger"
              type="button"
              onClick={() => remove(album)}
            >
              Remove
            </button>
          </div>
        </form>
      )}
    </article>
  );
}
