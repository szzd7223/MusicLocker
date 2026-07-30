package com.ledger.musiccatalog.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "app_users", uniqueConstraints = @UniqueConstraint(name = "uk_app_user_username", columnNames = "username"))
public class AppUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 50) private String username;
    @Column(nullable = false, length = 100) private String passwordHash;
    @Column(nullable = false, updatable = false) private Instant createdAt;

    @PrePersist void beforeCreate() { createdAt = Instant.now(); }
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public Instant getCreatedAt() { return createdAt; }
}
