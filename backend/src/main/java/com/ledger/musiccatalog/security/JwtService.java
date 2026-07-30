package com.ledger.musiccatalog.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {
    private final SecretKey key; private final long expirationMinutes;
    public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-minutes}") long expirationMinutes) { key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); this.expirationMinutes = expirationMinutes; }
    public String createToken(Long userId, String username) { Instant now = Instant.now(); return Jwts.builder().subject(userId.toString()).claim("username", username).issuedAt(Date.from(now)).expiration(Date.from(now.plusSeconds(expirationMinutes * 60))).signWith(key).compact(); }
    public AuthenticatedUser authenticatedUser(String token) {
        var claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        return new AuthenticatedUser(Long.valueOf(claims.getSubject()), claims.get("username", String.class));
    }
}
