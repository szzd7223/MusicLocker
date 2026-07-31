package com.ledger.musiccatalog.controller;

import com.ledger.musiccatalog.dto.SearchSongResponse;
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
    public List<SearchSongResponse> search(@RequestParam(name = "query") @NotBlank String query,
            @RequestParam(name = "type", defaultValue = "song") String type,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "12") int size) {
        List<SearchSongResponse> allResults = service.searchSongs(query, type);
        int fromIndex = page * size;
        if (fromIndex >= allResults.size()) {
            return List.of();
        }
        int toIndex = Math.min(fromIndex + size, allResults.size());
        return allResults.subList(fromIndex, toIndex);
    }
}
