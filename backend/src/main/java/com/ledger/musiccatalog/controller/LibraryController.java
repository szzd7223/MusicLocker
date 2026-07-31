package com.ledger.musiccatalog.controller;
import com.ledger.musiccatalog.dto.*;
import com.ledger.musiccatalog.service.LibraryService;
import com.ledger.musiccatalog.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.List;
@RestController @RequestMapping("/api/library")
public class LibraryController { private final LibraryService service; public LibraryController(LibraryService service) { this.service = service; }
    @GetMapping public ResponseEntity<?> all(@AuthenticationPrincipal AuthenticatedUser user,
                                             @RequestParam(name = "page", required = false) Integer page,
                                             @RequestParam(name = "size", required = false) Integer size) {
        if (page != null && size != null) {
            return ResponseEntity.ok(service.findAllPaginated(user.id(), page, size));
        }
        return ResponseEntity.ok(service.findAll(user.id()));
    }
    @PostMapping public ResponseEntity<AlbumResponse> create(@AuthenticationPrincipal AuthenticatedUser user, @Valid @RequestBody AlbumRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(user.id(), request)); }
    @PutMapping("/{id}") public AlbumResponse update(@AuthenticationPrincipal AuthenticatedUser user, @PathVariable Long id, @Valid @RequestBody AlbumRequest request) { return service.update(user.id(), id, request); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@AuthenticationPrincipal AuthenticatedUser user, @PathVariable Long id) { service.delete(user.id(), id); } }
