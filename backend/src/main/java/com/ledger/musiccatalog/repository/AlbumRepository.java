package com.ledger.musiccatalog.repository;

import com.ledger.musiccatalog.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    List<Album> findAllByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    Optional<Album> findByIdAndOwnerId(Long id, Long ownerId);
    boolean existsByAppleCatalogIdAndOwnerId(Long appleCatalogId, Long ownerId);
}
