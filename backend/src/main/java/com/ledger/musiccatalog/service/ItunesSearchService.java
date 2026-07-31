package com.ledger.musiccatalog.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.ledger.musiccatalog.dto.SearchAlbumResponse;
import com.ledger.musiccatalog.exception.BadRequestException;
import com.ledger.musiccatalog.exception.UpstreamServiceException;
import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestClientException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.StreamSupport;
import org.springframework.cache.annotation.Cacheable;

@Service
public class ItunesSearchService {
    private final RestClient client;
    private final ObjectMapper objectMapper;

    public ItunesSearchService(@Value("${app.itunes.base-url}") String baseUrl, ObjectMapper objectMapper) {
        client = RestClient.builder().baseUrl(baseUrl).build();
        this.objectMapper = objectMapper;
    }

    @Cacheable(value = "itunesSearch", key = "#p0")
    public List<SearchAlbumResponse> searchAlbums(String query, String type) {
        if (!"album".equalsIgnoreCase(type))
            throw new BadRequestException("Only type=album is supported in this album-focused project");
        String responseBody;
        try {
            responseBody = client.get().uri(builder -> builder.path("/search").queryParam("term", query)
                            .queryParam("entity", "album").queryParam("limit", 200).build())
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

    private SearchAlbumResponse map(JsonNode n) {
        LocalDate releaseDate = n.hasNonNull("releaseDate")
                ? LocalDate.parse(n.get("releaseDate").asText().substring(0, 10))
                : null;
        return new SearchAlbumResponse(n.path("collectionId").asLong(), n.path("collectionName").asText(),
                n.path("artistName").asText(), n.path("primaryGenreName").asText(null), releaseDate,
                n.path("trackCount").isNumber() ? n.path("trackCount").asInt() : null,
                n.path("artworkUrl100").asText(null));
    }
}
