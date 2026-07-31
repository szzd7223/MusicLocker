"use client";

import { FormEvent } from "react";
import { SearchSong } from "../types";

interface SaveDialogProps {
  song: SearchSong;
  rating: number;
  setRating: (value: number) => void;
  notes: string;
  setNotes: (value: string) => void;
  close: () => void;
  submit: (event: FormEvent) => void;
}

export function SaveDialog({
  song,
  rating,
  setRating,
  notes,
  setNotes,
  close,
  submit,
}: SaveDialogProps) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="save-dialog" onSubmit={submit}>
        <button className="close" type="button" onClick={close}>
          ×
        </button>
        <p className="eyebrow">ADD TO YOUR SHELF</p>
        <h2>{song.title}</h2>
        <p className="muted">{song.artistName}</p>
        <label>
          Your rating
          <div className="star-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                onClick={() => setRating(star)}
                className={star <= rating ? "star active" : "star"}
                key={star}
              >
                ★
              </button>
            ))}
          </div>
        </label>
        <label>
          A note for future you
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={4000}
            placeholder="What made you save this?"
          />
        </label>
        <button className="button primary wide">
          Save to my library <span>→</span>
        </button>
      </form>
    </div>
  );
}
