package com.ledger.musiccatalog.service;

import com.ledger.musiccatalog.dto.*;
import com.ledger.musiccatalog.model.Song;
import com.ledger.musiccatalog.repository.SongRepository;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    private final SongRepository songs;

    public AnalyticsService(SongRepository songs) {
        this.songs = songs;
    }

    public AnalyticsResponse getAnalytics(Long userId) {
        List<Song> library = songs.findAllByOwnerIdOrderByCreatedAtDesc(userId);
        return new AnalyticsResponse(
                summary(library),
                counts(library, song -> valueOrUnknown(song.getGenre())).stream().limit(10).toList(),
                releasesByYear(library),
                ratings(library),
                counts(library, song -> valueOrUnknown(song.getArtistName())).stream().limit(10).toList(),
                durationHistogram(library)
        );
    }

    private LibrarySummary summary(List<Song> library) {
        long totalDuration = library.stream()
                .map(Song::getDuration)
                .filter(Objects::nonNull)
                .mapToLong(Integer::longValue)
                .sum();
        OptionalDouble average = library.stream()
                .map(Song::getUserRating)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .average();
        Double averageRating = average.isPresent() ? average.getAsDouble() : null;
        long artists = library.stream()
                .map(Song::getArtistName)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .distinct()
                .count();
        long genres = library.stream()
                .map(Song::getGenre)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .distinct()
                .count();
        return new LibrarySummary(library.size(), artists, genres, totalDuration, averageRating);
    }

    private List<ChartPoint> releasesByYear(List<Song> library) {
        return library.stream()
                .filter(song -> song.getReleaseDate() != null)
                .collect(Collectors.groupingBy(song -> song.getReleaseDate().getYear(), TreeMap::new, Collectors.counting()))
                .entrySet().stream()
                .map(entry -> new ChartPoint(entry.getKey().toString(), entry.getValue()))
                .toList();
    }

    private List<ChartPoint> ratings(List<Song> library) {
        Map<Integer, Long> counts = library.stream()
                .map(Song::getUserRating)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        List<ChartPoint> result = new ArrayList<>();
        for (int rating = 1; rating <= 5; rating++) {
            result.add(new ChartPoint(rating + " stars", counts.getOrDefault(rating, 0L)));
        }
        return result;
    }

    private List<ChartPoint> durationHistogram(List<Song> library) {
        Map<String, Long> bins = new LinkedHashMap<>();
        bins.put("Short (< 3m)", 0L);
        bins.put("Medium (3-5m)", 0L);
        bins.put("Long (> 5m)", 0L);
        for (Song song : library) {
            if (song.getDuration() == null) continue;
            // duration is in milliseconds (3m = 180000ms, 5m = 300000ms)
            String bin = song.getDuration() <= 180000 ? "Short (< 3m)" : song.getDuration() <= 300000 ? "Medium (3-5m)" : "Long (> 5m)";
            bins.compute(bin, (key, value) -> value + 1);
        }
        return bins.entrySet().stream()
                .map(entry -> new ChartPoint(entry.getKey(), entry.getValue()))
                .toList();
    }

    private List<ChartPoint> counts(List<Song> library, Function<Song, String> classifier) {
        return library.stream()
                .collect(Collectors.groupingBy(classifier, Collectors.counting()))
                .entrySet().stream()
                .sorted(Comparator.<Map.Entry<String, Long>, Long>comparing(Map.Entry::getValue).reversed().thenComparing(Map.Entry::getKey))
                .map(entry -> new ChartPoint(entry.getKey(), entry.getValue()))
                .toList();
    }

    private String valueOrUnknown(String value) {
        return value == null || value.isBlank() ? "Unknown" : value.trim();
    }
}
