package com.ledger.musiccatalog.controller;

import com.ledger.musiccatalog.dto.AnalyticsResponse;
import com.ledger.musiccatalog.security.AuthenticatedUser;
import com.ledger.musiccatalog.service.AnalyticsService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    public AnalyticsController(AnalyticsService analyticsService) { this.analyticsService = analyticsService; }

    @GetMapping
    public AnalyticsResponse analytics(@AuthenticationPrincipal AuthenticatedUser user) {
        return analyticsService.getAnalytics(user.id());
    }
}
