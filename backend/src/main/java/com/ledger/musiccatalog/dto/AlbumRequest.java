package com.ledger.musiccatalog.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record AlbumRequest(
        @NotNull @Positive Long appleCatalogId,
        @NotBlank @Size(max = 255) String title,
        @NotBlank @Size(max = 255) String artistName,
        @Size(max = 100) String genre,
        LocalDate releaseDate,
        @PositiveOrZero Integer trackCount,
        @Size(max = 1000) String artworkUrl,
        @Min(1) @Max(5) Integer userRating,
        @Size(max = 4000) String userNotes) { }
