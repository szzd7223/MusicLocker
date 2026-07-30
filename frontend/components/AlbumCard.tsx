"use client";

import Image from "next/image";
import { SearchAlbum } from "../types";

interface AlbumCardProps {
  album: SearchAlbum;
  action: () => void;
  actionLabel: string;
}

export function AlbumCard({ album, action, actionLabel }: AlbumCardProps) {
  return (
    <article className="album-card">
      <div className="cover" style={{ position: "relative" }}>
        {album.artworkUrl ? (
          <Image
            src={album.artworkUrl.replace("100x100", "600x600")}
            alt={`Artwork for ${album.title}`}
            fill
            style={{ objectFit: "cover", borderRadius: "10px" }}
            sizes="105px"
          />
        ) : (
          <span>♫</span>
        )}
      </div>
      <div className="album-info">
        <p className="genre">{album.genre ?? "Album"}</p>
        <h3>{album.title}</h3>
        <p>{album.artistName}</p>
        <div className="album-meta">
          <span>{album.releaseDate?.slice(0, 4) ?? "—"}</span>
          <span>{album.trackCount ? `${album.trackCount} tracks` : ""}</span>
        </div>
        <button className="text-button" onClick={action}>
          {actionLabel} <span>→</span>
        </button>
      </div>
    </article>
  );
}
