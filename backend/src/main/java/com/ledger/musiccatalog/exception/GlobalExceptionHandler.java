package com.ledger.musiccatalog.exception;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NotFoundException.class) ResponseEntity<Map<String, Object>> notFound(NotFoundException ex) { return error(HttpStatus.NOT_FOUND, ex.getMessage()); }
    @ExceptionHandler(ConflictException.class) ResponseEntity<Map<String, Object>> conflict(ConflictException ex) { return error(HttpStatus.CONFLICT, ex.getMessage()); }
    @ExceptionHandler(BadRequestException.class) ResponseEntity<Map<String, Object>> badRequest(BadRequestException ex) { return error(HttpStatus.BAD_REQUEST, ex.getMessage()); }
    @ExceptionHandler(UpstreamServiceException.class) ResponseEntity<Map<String, Object>> upstream(UpstreamServiceException ex) { return error(HttpStatus.BAD_GATEWAY, ex.getMessage()); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, Object>> validation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream().findFirst().map(e -> e.getField() + ": " + e.getDefaultMessage()).orElse("Invalid request");
        return error(HttpStatus.BAD_REQUEST, message);
    }
    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<Map<String, Object>> responseStatus(ResponseStatusException ex) {
        return error(HttpStatus.valueOf(ex.getStatusCode().value()), ex.getReason() == null ? "Request failed" : ex.getReason());
    }
    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("timestamp", Instant.now().toString(), "status", status.value(), "error", status.getReasonPhrase(), "message", message));
    }
}
