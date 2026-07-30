package com.ledger.musiccatalog.dto;

import com.ledger.musiccatalog.model.Album;
import java.time.Instant;
import java.time.LocalDate;

public record AlbumResponse(Long id, Long appleCatalogId, String title, String artistName, String genre,
                            LocalDate releaseDate, Integer trackCount, String artworkUrl, Integer userRating,
                            String userNotes, Instant createdAt, Instant updatedAt) {
    public static AlbumResponse from(Album album) {
        return new AlbumResponse(album.getId(), album.getAppleCatalogId(), album.getTitle(), album.getArtistName(),
                album.getGenre(), album.getReleaseDate(), album.getTrackCount(), album.getArtworkUrl(),
                album.getUserRating(), album.getUserNotes(), album.getCreatedAt(), album.getUpdatedAt());
    }
}
