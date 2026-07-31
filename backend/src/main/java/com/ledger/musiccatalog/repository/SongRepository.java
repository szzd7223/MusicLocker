package com.ledger.musiccatalog.repository;

import com.ledger.musiccatalog.model.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findAllByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    Page<Song> findAllByOwnerId(Long ownerId, Pageable pageable);
    Optional<Song> findByIdAndOwnerId(Long id, Long ownerId);
    boolean existsByAppleCatalogIdAndOwnerId(Long appleCatalogId, Long ownerId);
}
