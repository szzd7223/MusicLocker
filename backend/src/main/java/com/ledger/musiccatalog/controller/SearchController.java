package com.ledger.musiccatalog.controller;

import com.ledger.musiccatalog.dto.SearchAlbumResponse;
import com.ledger.musiccatalog.service.ItunesSearchService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api/search")
public class SearchController {
    private final ItunesSearchService service;

    public SearchController(ItunesSearchService service) {
        this.service = service;
    }

    @GetMapping
    public List<SearchAlbumResponse> search(@RequestParam(name = "query") @NotBlank String query,
            @RequestParam(name = "type", defaultValue = "album") String type) {
        return service.searchAlbums(query, type);
    }
}
