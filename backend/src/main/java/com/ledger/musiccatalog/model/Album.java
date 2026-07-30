package com.ledger.musiccatalog.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "albums", uniqueConstraints = @UniqueConstraint(name = "uk_album_user_catalog_id", columnNames = {"user_id", "apple_catalog_id"}))
public class Album {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "apple_catalog_id", nullable = false) private Long appleCatalogId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private AppUser owner;
    @Column(nullable = false) private String title;
    @Column(nullable = false) private String artistName;
    private String genre;
    private LocalDate releaseDate;
    private Integer trackCount;
    @Column(length = 1000) private String artworkUrl;
    private Integer userRating;
    @Column(length = 4000) private String userNotes;
    @Column(nullable = false, updatable = false) private Instant createdAt;
    @Column(nullable = false) private Instant updatedAt;

    @PrePersist void beforeCreate() { createdAt = Instant.now(); updatedAt = createdAt; }
    @PreUpdate void beforeUpdate() { updatedAt = Instant.now(); }
    public Long getId() { return id; } public Long getAppleCatalogId() { return appleCatalogId; } public void setAppleCatalogId(Long value) { appleCatalogId = value; }
    public AppUser getOwner() { return owner; } public void setOwner(AppUser value) { owner = value; }
    public String getTitle() { return title; } public void setTitle(String value) { title = value; }
    public String getArtistName() { return artistName; } public void setArtistName(String value) { artistName = value; }
    public String getGenre() { return genre; } public void setGenre(String value) { genre = value; }
    public LocalDate getReleaseDate() { return releaseDate; } public void setReleaseDate(LocalDate value) { releaseDate = value; }
    public Integer getTrackCount() { return trackCount; } public void setTrackCount(Integer value) { trackCount = value; }
    public String getArtworkUrl() { return artworkUrl; } public void setArtworkUrl(String value) { artworkUrl = value; }
    public Integer getUserRating() { return userRating; } public void setUserRating(Integer value) { userRating = value; }
    public String getUserNotes() { return userNotes; } public void setUserNotes(String value) { userNotes = value; }
    public Instant getCreatedAt() { return createdAt; } public Instant getUpdatedAt() { return updatedAt; }
}
