package com.ledger.musiccatalog.dto;

public record LibrarySummary(long savedSongs, long distinctArtists, long distinctGenres,
                             long totalDuration, Double averageUserRating) { }
