package com.ledger.musiccatalog.controller;

import com.ledger.musiccatalog.security.JwtService;
import com.ledger.musiccatalog.security.RestAuthenticationEntryPoint;
import com.ledger.musiccatalog.service.ItunesSearchService;
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

@WebMvcTest(controllers = {SearchController.class, HealthController.class})
@Import({com.ledger.musiccatalog.security.SecurityConfig.class, SecurityConfigurationTest.TestBeans.class})
class SecurityConfigurationTest {
    @Autowired MockMvc mockMvc;

    @Test void allowsUnauthenticatedSearchRequests() throws Exception {
        mockMvc.perform(get("/api/search").param("query", "coldplay").param("type", "song"))
                .andExpect(status().isOk());
    }

    @TestConfiguration
    static class TestBeans {
        @Bean ItunesSearchService itunesSearchService() { return mock(ItunesSearchService.class); }
        @Bean JwtService jwtService() { return mock(JwtService.class); }
        @Bean RestAuthenticationEntryPoint restAuthenticationEntryPoint() { return new RestAuthenticationEntryPoint(); }
    }
}
