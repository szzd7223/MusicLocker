"use client";

import Image from "next/image";
import { SearchSong } from "../types";

interface SongCardProps {
  song: SearchSong;
  action: () => void;
  actionLabel: string;
}

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function SongCard({ song, action, actionLabel }: SongCardProps) {
  return (
    <article className="album-card">
      <div className="cover" style={{ position: "relative" }}>
        {song.artworkUrl ? (
          <Image
            src={song.artworkUrl.replace("100x100", "600x600")}
            alt={`Artwork for ${song.title}`}
            fill
            style={{ objectFit: "cover", borderRadius: "10px" }}
            sizes="105px"
          />
        ) : (
          <span>♫</span>
        )}
      </div>
      <div className="album-info">
        <p className="genre">{song.genre ?? "Song"}</p>
        <h3>{song.title}</h3>
        <p>{song.artistName}</p>
        <div className="album-meta">
          <span>{song.releaseDate?.slice(0, 4) ?? "—"}</span>
          <span>{song.duration ? formatDuration(song.duration) : ""}</span>
        </div>
        <button className="text-button" onClick={action}>
          {actionLabel} <span>→</span>
        </button>
      </div>
    </article>
  );
}
