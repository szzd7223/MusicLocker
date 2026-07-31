package com.ledger.musiccatalog.dto;

import java.time.LocalDate;

public record SearchSongResponse(Long appleCatalogId, String title, String artistName, String genre,
                                  LocalDate releaseDate, Integer duration, String artworkUrl) { }
