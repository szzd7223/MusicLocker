package com.ledger.musiccatalog.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank @Pattern(regexp = "^[A-Za-z0-9_-]{3,50}$", message = "must be 3-50 characters and use only letters, numbers, underscores, or hyphens") String username,
        @NotBlank @Size(min = 8, max = 72, message = "must be 8-72 characters") String password) { }
