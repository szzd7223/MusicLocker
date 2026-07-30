package com.ledger.musiccatalog.dto;

import java.time.LocalDate;

public record SearchAlbumResponse(Long appleCatalogId, String title, String artistName, String genre,
                                  LocalDate releaseDate, Integer trackCount, String artworkUrl) { }
