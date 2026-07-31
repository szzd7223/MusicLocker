package com.ledger.musiccatalog.dto;

import java.util.List;

public record AnalyticsResponse(
        LibrarySummary summary,
        List<ChartPoint> genreDistribution,
        List<ChartPoint> releasesByYear,
        List<ChartPoint> ratingsDistribution,
        List<ChartPoint> topArtists,
        List<ChartPoint> durationHistogram) { }
