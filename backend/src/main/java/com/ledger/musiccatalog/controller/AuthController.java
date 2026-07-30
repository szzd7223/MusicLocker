package com.ledger.musiccatalog.controller;

import com.ledger.musiccatalog.dto.*;
import com.ledger.musiccatalog.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }
    @PostMapping("/register") TokenResponse register(@Valid @RequestBody RegisterRequest request) { return authService.register(request); }
    @PostMapping("/login") TokenResponse login(@Valid @RequestBody LoginRequest request) { return authService.login(request); }
}
