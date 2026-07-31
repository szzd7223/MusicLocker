package com.ledger.musiccatalog.dto;

import com.ledger.musiccatalog.model.Song;
import java.time.Instant;
import java.time.LocalDate;

public record SongResponse(Long id, Long appleCatalogId, String title, String artistName, String genre,
                            LocalDate releaseDate, Integer duration, String artworkUrl, Integer userRating,
                            String userNotes, Instant createdAt, Instant updatedAt) {
    public static SongResponse from(Song song) {
        return new SongResponse(song.getId(), song.getAppleCatalogId(), song.getTitle(), song.getArtistName(),
                song.getGenre(), song.getReleaseDate(), song.getDuration(), song.getArtworkUrl(),
                song.getUserRating(), song.getUserNotes(), song.getCreatedAt(), song.getUpdatedAt());
    }
}
