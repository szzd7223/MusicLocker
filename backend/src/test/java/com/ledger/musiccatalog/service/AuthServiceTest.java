package com.ledger.musiccatalog.service;

import com.ledger.musiccatalog.dto.RegisterRequest;
import com.ledger.musiccatalog.exception.ConflictException;
import com.ledger.musiccatalog.repository.AppUserRepository;
import com.ledger.musiccatalog.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock AppUserRepository users;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @InjectMocks AuthService service;

    @Test void hashesPasswordBeforeSavingNewUser() {
        when(users.existsByUsername("alice")).thenReturn(false);
        when(passwordEncoder.encode("long-password")).thenReturn("bcrypt-hash");
        when(users.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.createToken(any(), any())).thenReturn("token");

        assertThat(service.register(new RegisterRequest("alice", "long-password")).token()).isEqualTo("token");
        verify(passwordEncoder).encode("long-password");
    }

    @Test void refusesDuplicateUsername() {
        when(users.existsByUsername("alice")).thenReturn(true);
        assertThatThrownBy(() -> service.register(new RegisterRequest("alice", "long-password"))).isInstanceOf(ConflictException.class);
    }
}
