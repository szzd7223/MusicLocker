package com.ledger.musiccatalog.service;

import com.ledger.musiccatalog.dto.*;
import com.ledger.musiccatalog.exception.*;
import com.ledger.musiccatalog.model.Song;
import com.ledger.musiccatalog.repository.SongRepository;
import com.ledger.musiccatalog.repository.AppUserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class LibraryService {
    private final SongRepository repository;
    private final AppUserRepository users;

    public LibraryService(SongRepository repository, AppUserRepository users) {
        this.repository = repository;
        this.users = users;
    }

    public List<SongResponse> findAll(Long userId) {
        return repository.findAllByOwnerIdOrderByCreatedAtDesc(userId).stream()
                .map(SongResponse::from)
                .toList();
    }

    public PageResponse<SongResponse> findAllPaginated(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Song> songPage = repository.findAllByOwnerId(userId, pageable);
        List<SongResponse> content = songPage.getContent().stream()
                .map(SongResponse::from)
                .toList();
        return new PageResponse<>(
                content,
                songPage.getNumber(),
                songPage.getSize(),
                songPage.getTotalElements(),
                songPage.getTotalPages(),
                songPage.isLast()
        );
    }

    public SongResponse create(Long userId, SongRequest request) {
        if (repository.existsByAppleCatalogIdAndOwnerId(request.appleCatalogId(), userId)) {
            throw new ConflictException("This Apple catalog song is already in your library");
        }
        Song song = toEntity(request, new Song());
        song.setOwner(users.getReferenceById(userId));
        return SongResponse.from(repository.save(song));
    }

    public SongResponse update(Long userId, Long id, SongRequest request) {
        Song song = repository.findByIdAndOwnerId(id, userId)
                .orElseThrow(() -> new NotFoundException("Song " + id + " was not found"));
        if (!song.getAppleCatalogId().equals(request.appleCatalogId())
                && repository.existsByAppleCatalogIdAndOwnerId(request.appleCatalogId(), userId)) {
            throw new ConflictException("This Apple catalog song is already in your library");
        }
        return SongResponse.from(repository.save(toEntity(request, song)));
    }

    public void delete(Long userId, Long id) {
        Song song = repository.findByIdAndOwnerId(id, userId)
                .orElseThrow(() -> new NotFoundException("Song " + id + " was not found"));
        repository.delete(song);
    }

    private Song toEntity(SongRequest r, Song s) {
        s.setAppleCatalogId(r.appleCatalogId());
        s.setTitle(r.title());
        s.setArtistName(r.artistName());
        s.setGenre(r.genre());
        s.setReleaseDate(r.releaseDate());
        s.setDuration(r.duration());
        s.setArtworkUrl(r.artworkUrl());
        s.setUserRating(r.userRating());
        s.setUserNotes(r.userNotes());
        return s;
    }
}
