package com.ledger.musiccatalog.dto;

import java.util.List;

public record CurationResponse(
        String persona,
        String summary,
        String critique,
        List<Recommendation> recommendations,
        boolean isMock) {

    public record Recommendation(
            String title,
            String artist,
            String rationale) {}
}
