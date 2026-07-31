"use client";

import { useState } from "react";
import { Song } from "../types";
import { SongCard } from "./SongCard";

interface LibraryCardProps {
  song: Song;
  update: (song: Song, patch: Partial<Song>) => void;
  remove: (song: Song) => void;
}

export function LibraryCard({ song, update, remove }: LibraryCardProps) {
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(song.userRating ?? 3);
  const [notes, setNotes] = useState(song.userNotes ?? "");

  return (
    <article className="library-card">
      <SongCard
        song={song}
        action={() => setEditing(!editing)}
        actionLabel={editing ? "Close editor" : "Edit details"}
      />
      {editing && (
        <form
          className="inline-editor"
          onSubmit={(e) => {
            e.preventDefault();
            update(song, { userRating: rating, userNotes: notes });
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
              placeholder="Why does this song matter to you?"
            />
          </label>
          <div>
            <button className="button small primary">Save</button>
            <button
              className="button small danger"
              type="button"
              onClick={() => remove(song)}
            >
              Remove
            </button>
          </div>
        </form>
      )}
    </article>
  );
}
