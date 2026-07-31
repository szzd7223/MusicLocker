package com.ledger.musiccatalog.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.ledger.musiccatalog.dto.SearchSongResponse;
import com.ledger.musiccatalog.exception.BadRequestException;
import com.ledger.musiccatalog.exception.UpstreamServiceException;
import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestClientException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.StreamSupport;

@Service
public class ItunesSearchService {
    private final RestClient client;
    private final ObjectMapper objectMapper;

    public ItunesSearchService(@Value("${app.itunes.base-url}") String baseUrl, ObjectMapper objectMapper) {
        client = RestClient.builder().baseUrl(baseUrl).build();
        this.objectMapper = objectMapper;
    }

    @Cacheable(value = "itunesSearch", key = "#p0")
    public List<SearchSongResponse> searchSongs(String query, String type) {
        if (!"song".equalsIgnoreCase(type))
            throw new BadRequestException("Only type=song is supported in this song-focused project");
        String responseBody;
        try {
            responseBody = client.get().uri(builder -> builder.path("/search").queryParam("term", query)
                            .queryParam("entity", "song").queryParam("limit", 200).build())
                    .header(HttpHeaders.USER_AGENT, "Mozilla/5.0 (compatible; MusicCatalogInsights/1.0)")
                    .header(HttpHeaders.ACCEPT, "application/json")
                    .retrieve().body(String.class);
        } catch (RestClientResponseException ex) {
            throw new UpstreamServiceException("The iTunes catalog is temporarily unavailable (HTTP " + ex.getStatusCode().value() + ")");
        } catch (RestClientException ex) {
            throw new UpstreamServiceException("The iTunes catalog could not be reached");
        }
        JsonNode body;
        try {
            body = responseBody == null ? null : objectMapper.readTree(responseBody);
        } catch (JsonProcessingException ex) {
            throw new UpstreamServiceException("The iTunes catalog returned an invalid response");
        }
        if (body == null || !body.has("results"))
            return List.of();
        return StreamSupport.stream(body.get("results").spliterator(), false).map(this::map).toList();
    }

    private SearchSongResponse map(JsonNode n) {
        LocalDate releaseDate = n.hasNonNull("releaseDate")
                ? LocalDate.parse(n.get("releaseDate").asText().substring(0, 10))
                : null;
        return new SearchSongResponse(
                n.path("trackId").asLong(),
                n.path("trackName").asText(),
                n.path("artistName").asText(),
                n.path("primaryGenreName").asText(null),
                releaseDate,
                n.path("trackTimeMillis").isNumber() ? n.path("trackTimeMillis").asInt() : null,
                n.path("artworkUrl100").asText(null)
        );
    }
}
