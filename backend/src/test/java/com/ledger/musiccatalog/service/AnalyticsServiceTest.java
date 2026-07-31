package com.ledger.musiccatalog.service;

import com.ledger.musiccatalog.dto.AnalyticsResponse;
import com.ledger.musiccatalog.model.Song;
import com.ledger.musiccatalog.repository.SongRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {
    @Mock SongRepository songs;
    @InjectMocks AnalyticsService service;

    @Test void returnsChartDataAndSummaryForOnlyTheAuthenticatedUsersLibrary() {
        when(songs.findAllByOwnerIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(
                song("Parachutes", "Coldplay", "Alternative", 2000, 200000, 5), // Medium
                song("A Rush of Blood to the Head", "Coldplay", "Alternative", 2002, 120000, 4), // Short
                song("21", "Adele", "Pop", 2011, 350000, null))); // Long

        AnalyticsResponse result = service.getAnalytics(1L);

        assertThat(result.summary().savedSongs()).isEqualTo(3);
        assertThat(result.summary().totalDuration()).isEqualTo(670000);
        assertThat(result.summary().averageUserRating()).isEqualTo(4.5);
        assertThat(result.genreDistribution()).extracting(point -> point.label()).containsExactly("Alternative", "Pop");
        assertThat(result.releasesByYear()).extracting(point -> point.label()).containsExactly("2000", "2002", "2011");
        assertThat(result.ratingsDistribution()).extracting(point -> point.value()).containsExactly(0L, 0L, 0L, 1L, 1L);
        assertThat(result.topArtists().getFirst().label()).isEqualTo("Coldplay");
        
        // Assert duration histogram values
        assertThat(result.durationHistogram()).extracting(point -> point.label()).containsExactly("Short (< 3m)", "Medium (3-5m)", "Long (> 5m)");
        assertThat(result.durationHistogram()).extracting(point -> point.value()).containsExactly(1L, 1L, 1L);
    }

    private Song song(String title, String artist, String genre, int year, int durationMs, Integer rating) {
        Song song = new Song();
        song.setTitle(title); song.setArtistName(artist); song.setGenre(genre); song.setReleaseDate(LocalDate.of(year, 1, 1));
        song.setDuration(durationMs); song.setUserRating(rating); return song;
    }
}
