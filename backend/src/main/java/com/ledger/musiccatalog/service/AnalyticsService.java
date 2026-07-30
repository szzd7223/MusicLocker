package com.ledger.musiccatalog.service;

import com.ledger.musiccatalog.dto.*;
import com.ledger.musiccatalog.model.Album;
import com.ledger.musiccatalog.repository.AlbumRepository;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    private final AlbumRepository albums;

    public AnalyticsService(AlbumRepository albums) { this.albums = albums; }

    public AnalyticsResponse getAnalytics(Long userId) {
        List<Album> library = albums.findAllByOwnerIdOrderByCreatedAtDesc(userId);
        return new AnalyticsResponse(
                summary(library),
                counts(library, album -> valueOrUnknown(album.getGenre())).stream().limit(10).toList(),
                releasesByYear(library),
                ratings(library),
                counts(library, album -> valueOrUnknown(album.getArtistName())).stream().limit(10).toList(),
                trackCountHistogram(library));
    }

    private LibrarySummary summary(List<Album> library) {
        long totalTracks = library.stream().map(Album::getTrackCount).filter(Objects::nonNull).mapToLong(Integer::longValue).sum();
        OptionalDouble average = library.stream().map(Album::getUserRating).filter(Objects::nonNull).mapToInt(Integer::intValue).average();
        Double averageRating = average.isPresent() ? average.getAsDouble() : null;
        long artists = library.stream().map(Album::getArtistName).filter(Objects::nonNull).map(String::trim).filter(value -> !value.isEmpty()).distinct().count();
        long genres = library.stream().map(Album::getGenre).filter(Objects::nonNull).map(String::trim).filter(value -> !value.isEmpty()).distinct().count();
        return new LibrarySummary(library.size(), artists, genres, totalTracks, averageRating);
    }

    private List<ChartPoint> releasesByYear(List<Album> library) {
        return library.stream().filter(album -> album.getReleaseDate() != null)
                .collect(Collectors.groupingBy(album -> album.getReleaseDate().getYear(), TreeMap::new, Collectors.counting()))
                .entrySet().stream().map(entry -> new ChartPoint(entry.getKey().toString(), entry.getValue())).toList();
    }

    private List<ChartPoint> ratings(List<Album> library) {
        Map<Integer, Long> counts = library.stream().map(Album::getUserRating).filter(Objects::nonNull)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        List<ChartPoint> result = new ArrayList<>();
        for (int rating = 1; rating <= 5; rating++) result.add(new ChartPoint(rating + " stars", counts.getOrDefault(rating, 0L)));
        return result;
    }

    private List<ChartPoint> trackCountHistogram(List<Album> library) {
        Map<String, Long> bins = new LinkedHashMap<>();
        bins.put("0-5 tracks", 0L); bins.put("6-10 tracks", 0L); bins.put("11-15 tracks", 0L); bins.put("16+ tracks", 0L);
        for (Album album : library) {
            if (album.getTrackCount() == null) continue;
            String bin = album.getTrackCount() <= 5 ? "0-5 tracks" : album.getTrackCount() <= 10 ? "6-10 tracks" : album.getTrackCount() <= 15 ? "11-15 tracks" : "16+ tracks";
            bins.compute(bin, (key, value) -> value + 1);
        }
        return bins.entrySet().stream().map(entry -> new ChartPoint(entry.getKey(), entry.getValue())).toList();
    }

    private List<ChartPoint> counts(List<Album> library, Function<Album, String> classifier) {
        return library.stream().collect(Collectors.groupingBy(classifier, Collectors.counting())).entrySet().stream()
                .sorted(Comparator.<Map.Entry<String, Long>, Long>comparing(Map.Entry::getValue).reversed().thenComparing(Map.Entry::getKey))
                .map(entry -> new ChartPoint(entry.getKey(), entry.getValue())).toList();
    }

    private String valueOrUnknown(String value) { return value == null || value.isBlank() ? "Unknown" : value.trim(); }
}
