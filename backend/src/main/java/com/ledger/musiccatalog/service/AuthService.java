package com.ledger.musiccatalog.service;

import com.ledger.musiccatalog.dto.*;
import com.ledger.musiccatalog.exception.ConflictException;
import com.ledger.musiccatalog.model.AppUser;
import com.ledger.musiccatalog.repository.AppUserRepository;
import com.ledger.musiccatalog.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AuthService {
    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AppUserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.users = users; this.passwordEncoder = passwordEncoder; this.jwtService = jwtService;
    }

    public TokenResponse register(RegisterRequest request) {
        if (users.existsByUsername(request.username())) throw new ConflictException("That username is already taken");
        AppUser user = new AppUser();
        user.setUsername(request.username());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        return tokenFor(users.save(user));
    }

    public TokenResponse login(LoginRequest request) {
        AppUser user = users.findByUsername(request.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }
        return tokenFor(user);
    }

    private TokenResponse tokenFor(AppUser user) {
        return new TokenResponse(jwtService.createToken(user.getId(), user.getUsername()), "Bearer");
    }
}
