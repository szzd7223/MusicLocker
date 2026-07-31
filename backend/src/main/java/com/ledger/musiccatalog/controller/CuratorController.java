package com.ledger.musiccatalog.controller;

import com.ledger.musiccatalog.dto.CurationResponse;
import com.ledger.musiccatalog.model.Song;
import com.ledger.musiccatalog.repository.SongRepository;
import com.ledger.musiccatalog.security.AuthenticatedUser;
import com.ledger.musiccatalog.service.GeminiService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/curator")
public class CuratorController {
    private final GeminiService service;
    private final SongRepository repository;

    public CuratorController(GeminiService service, SongRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @GetMapping
    public CurationResponse getCuration(@AuthenticationPrincipal AuthenticatedUser user) {
        List<Song> songsList = repository.findAllByOwnerIdOrderByCreatedAtDesc(user.id());
        return service.getCuration(songsList);
    }
}
