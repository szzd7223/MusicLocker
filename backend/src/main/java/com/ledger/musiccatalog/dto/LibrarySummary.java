package com.ledger.musiccatalog.dto;

public record LibrarySummary(long savedAlbums, long distinctArtists, long distinctGenres,
                             long totalTracks, Double averageUserRating) { }
