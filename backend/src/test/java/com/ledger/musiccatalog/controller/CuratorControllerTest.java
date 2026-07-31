package com.ledger.musiccatalog.controller;

import com.ledger.musiccatalog.service.GeminiService;
import com.ledger.musiccatalog.repository.SongRepository;
import com.ledger.musiccatalog.security.JwtService;
import com.ledger.musiccatalog.security.RestAuthenticationEntryPoint;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {CuratorController.class})
@Import({com.ledger.musiccatalog.security.SecurityConfig.class, CuratorControllerTest.TestBeans.class})
class CuratorControllerTest {
    @Autowired MockMvc mockMvc;

    @Test void blocksUnauthenticatedCuratorRequests() throws Exception {
        mockMvc.perform(get("/api/curator"))
                .andExpect(status().isUnauthorized());
    }

    @TestConfiguration
    static class TestBeans {
        @Bean GeminiService geminiService() { return mock(GeminiService.class); }
        @Bean SongRepository songRepository() { return mock(SongRepository.class); }
        @Bean JwtService jwtService() { return mock(JwtService.class); }
        @Bean RestAuthenticationEntryPoint restAuthenticationEntryPoint() { return new RestAuthenticationEntryPoint(); }
    }
}
