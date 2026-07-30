package com.ledger.musiccatalog.service;

import com.ledger.musiccatalog.dto.*;
import com.ledger.musiccatalog.exception.ConflictException;
import com.ledger.musiccatalog.model.Album;
import com.ledger.musiccatalog.repository.AlbumRepository;
import com.ledger.musiccatalog.repository.AppUserRepository;
import com.ledger.musiccatalog.model.AppUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LibraryServiceTest {
    @Mock AlbumRepository repository;
    @Mock AppUserRepository users;
    @InjectMocks LibraryService service;

    private AlbumRequest request() { return new AlbumRequest(1440806041L, "Parachutes", "Coldplay", "Alternative", null, 10, null, 5, "Great"); }

    @Test void createsAlbumWhenAppleIdIsNew() {
        when(repository.existsByAppleCatalogIdAndOwnerId(1440806041L, 1L)).thenReturn(false);
        when(users.getReferenceById(1L)).thenReturn(new AppUser());
        when(repository.save(any(Album.class))).thenAnswer(invocation -> invocation.getArgument(0));
        AlbumResponse result = service.create(1L, request());
        assertThat(result.title()).isEqualTo("Parachutes");
        verify(repository).save(any(Album.class));
    }

    @Test void rejectsDuplicateAppleId() {
        when(repository.existsByAppleCatalogIdAndOwnerId(1440806041L, 1L)).thenReturn(true);
        assertThatThrownBy(() -> service.create(1L, request())).isInstanceOf(ConflictException.class);
        verify(repository, never()).save(any());
    }

    @Test void throwsNotFoundWhenUpdatingMissingAlbum() {
        when(repository.findByIdAndOwnerId(99L, 1L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.update(1L, 99L, request())).hasMessageContaining("99");
    }
}
