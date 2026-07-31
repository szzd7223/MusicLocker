package com.ledger.musiccatalog.service;

import com.ledger.musiccatalog.dto.*;
import com.ledger.musiccatalog.exception.*;
import com.ledger.musiccatalog.model.Album;
import com.ledger.musiccatalog.repository.AlbumRepository;
import com.ledger.musiccatalog.repository.AppUserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class LibraryService {
    private final AlbumRepository repository; private final AppUserRepository users;
    public LibraryService(AlbumRepository repository, AppUserRepository users) { this.repository = repository; this.users = users; }
    public List<AlbumResponse> findAll(Long userId) { return repository.findAllByOwnerIdOrderByCreatedAtDesc(userId).stream().map(AlbumResponse::from).toList(); }
    public PageResponse<AlbumResponse> findAllPaginated(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Album> albumPage = repository.findAllByOwnerId(userId, pageable);
        List<AlbumResponse> content = albumPage.getContent().stream().map(AlbumResponse::from).toList();
        return new PageResponse<>(content, albumPage.getNumber(), albumPage.getSize(), albumPage.getTotalElements(), albumPage.getTotalPages(), albumPage.isLast());
    }
    public AlbumResponse create(Long userId, AlbumRequest request) {
        if (repository.existsByAppleCatalogIdAndOwnerId(request.appleCatalogId(), userId)) throw new ConflictException("This Apple catalog album is already in your library");
        Album album = toEntity(request, new Album()); album.setOwner(users.getReferenceById(userId));
        return AlbumResponse.from(repository.save(album));
    }
    public AlbumResponse update(Long userId, Long id, AlbumRequest request) {
        Album album = repository.findByIdAndOwnerId(id, userId).orElseThrow(() -> new NotFoundException("Album " + id + " was not found"));
        if (!album.getAppleCatalogId().equals(request.appleCatalogId()) && repository.existsByAppleCatalogIdAndOwnerId(request.appleCatalogId(), userId)) throw new ConflictException("This Apple catalog album is already in your library");
        return AlbumResponse.from(repository.save(toEntity(request, album)));
    }
    public void delete(Long userId, Long id) {
        Album album = repository.findByIdAndOwnerId(id, userId).orElseThrow(() -> new NotFoundException("Album " + id + " was not found"));
        repository.delete(album);
    }
    private Album toEntity(AlbumRequest r, Album a) {
        a.setAppleCatalogId(r.appleCatalogId()); a.setTitle(r.title()); a.setArtistName(r.artistName()); a.setGenre(r.genre());
        a.setReleaseDate(r.releaseDate()); a.setTrackCount(r.trackCount()); a.setArtworkUrl(r.artworkUrl());
        a.setUserRating(r.userRating()); a.setUserNotes(r.userNotes()); return a;
    }
}
