package com.ledger.musiccatalog.service;

import com.ledger.musiccatalog.dto.AnalyticsResponse;
import com.ledger.musiccatalog.model.Album;
import com.ledger.musiccatalog.repository.AlbumRepository;
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
    @Mock AlbumRepository albums;
    @InjectMocks AnalyticsService service;

    @Test void returnsChartDataAndSummaryForOnlyTheAuthenticatedUsersLibrary() {
        when(albums.findAllByOwnerIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(
                album("Parachutes", "Coldplay", "Alternative", 2000, 10, 5),
                album("A Rush of Blood to the Head", "Coldplay", "Alternative", 2002, 11, 4),
                album("21", "Adele", "Pop", 2011, 12, null)));

        AnalyticsResponse result = service.getAnalytics(1L);

        assertThat(result.summary().savedAlbums()).isEqualTo(3);
        assertThat(result.summary().totalTracks()).isEqualTo(33);
        assertThat(result.summary().averageUserRating()).isEqualTo(4.5);
        assertThat(result.genreDistribution()).extracting(point -> point.label()).containsExactly("Alternative", "Pop");
        assertThat(result.releasesByYear()).extracting(point -> point.label()).containsExactly("2000", "2002", "2011");
        assertThat(result.ratingsDistribution()).extracting(point -> point.value()).containsExactly(0L, 0L, 0L, 1L, 1L);
        assertThat(result.topArtists().getFirst().label()).isEqualTo("Coldplay");
    }

    private Album album(String title, String artist, String genre, int year, int tracks, Integer rating) {
        Album album = new Album();
        album.setTitle(title); album.setArtistName(artist); album.setGenre(genre); album.setReleaseDate(LocalDate.of(year, 1, 1));
        album.setTrackCount(tracks); album.setUserRating(rating); return album;
    }
}
