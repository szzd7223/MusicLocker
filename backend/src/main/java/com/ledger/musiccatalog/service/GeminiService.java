package com.ledger.musiccatalog.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ledger.musiccatalog.dto.CurationResponse;
import com.ledger.musiccatalog.model.Song;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GeminiService {
    private final RestClient client;
    private final String apiKey;
    private final ObjectMapper mapper;

    public GeminiService(
            @Value("${app.gemini.base-url}") String baseUrl,
            @Value("${app.gemini.api-key}") String apiKey,
            ObjectMapper mapper) {
        this.client = RestClient.builder().baseUrl(baseUrl).build();
        this.apiKey = apiKey;
        this.mapper = mapper;
    }

    public CurationResponse getCuration(List<Song> songs) {
        if (apiKey == null || apiKey.isBlank()) {
            return getMockCuration();
        }

        if (songs.isEmpty()) {
            return new CurationResponse(
                    "Quiet Listener",
                    "Your library is currently empty. Save some songs in the Discover tab, and I will analyze your musical taste!",
                    "There is nothing to review yet. Get searching!",
                    List.of(),
                    false);
        }

        String songList = songs.stream()
                .map(s -> String.format(
                        "- Title: \"%s\", Artist: \"%s\", Genre: \"%s\", Year: %s, Rating: %s, Notes: \"%s\"",
                        s.getTitle(), s.getArtistName(), s.getGenre(),
                        s.getReleaseDate() != null ? s.getReleaseDate().getYear() : "Unknown",
                        s.getUserRating() != null ? s.getUserRating() + "/5" : "Unrated",
                        s.getUserNotes() != null ? s.getUserNotes() : ""))
                .collect(Collectors.joining("\n"));

        String prompt = "You are an expert music critic. Analyze the user's saved songs library below and compile their curation report:\n\n"
                + songList + "\n\n"
                + "Generate a JSON response matching exactly this schema:\n"
                + "{\n"
                + "  \"persona\": \"A 2-3 word musical personality archetype (e.g. 'Chill Indie Explorer')\",\n"
                + "  \"summary\": \"A 2-3 sentence engaging breakdown of their taste and patterns, mentioning specific details from their library.\",\n"
                + "  \"critique\": \"A witty, slightly humorous 1-2 sentence critique of their library (friendly roast or observation).\",\n"
                + "  \"recommendations\": [\n"
                + "    {\n"
                + "      \"title\": \"Song Title\",\n"
                + "      \"artist\": \"Artist Name\",\n"
                + "      \"rationale\": \"Why they would love it based on specific songs in their library.\"\n"
                + "    }\n"
                + "  ]\n"
                + "}\n"
                + "Provide ONLY the raw JSON output. Do not include markdown wrappers or extra commentary.";

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of("responseMimeType", "application/json"));

        try {
            String response = client.post()
                    .uri(builder -> builder.path("/v1beta/models/gemini-3.5-flash-lite:generateContent")
                            .queryParam("key", apiKey)
                            .build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            ObjectMapper localMapper = new ObjectMapper();
            var node = localMapper.readTree(response);
            String text = node.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();

            String cleanText = cleanJsonString(text);
            CurationResponse result = mapper.readValue(cleanText, CurationResponse.class);
            return new CurationResponse(
                    result.persona(),
                    result.summary(),
                    result.critique(),
                    result.recommendations(),
                    false);
        } catch (Exception ex) {
            ex.printStackTrace();
            System.err.println("Gemini API Call Failed: " + ex.getMessage());
            return getMockCuration();
        }
    }

    private String cleanJsonString(String raw) {
        String clean = raw.trim();
        if (clean.startsWith("```")) {
            int firstLineBreak = clean.indexOf("\n");
            int lastBackticks = clean.lastIndexOf("```");
            if (firstLineBreak != -1 && lastBackticks != -1 && lastBackticks > firstLineBreak) {
                clean = clean.substring(firstLineBreak, lastBackticks).trim();
            }
        }
        return clean;
    }

    private CurationResponse getMockCuration() {
        return new CurationResponse(
                "Vibrant Melophile (Sample)",
                "Your library showcases an eclectic appreciation for catchy melodies and rhythmic grooves. You have a solid rotation of distinct artists, with release dates indicating a healthy mix of modern releases and classic formats.",
                "You seem to rate almost everything 5 stars. Don't be afraid to be critical—even your favorite artists have some skips!",
                List.of(
                        new CurationResponse.Recommendation("Blinding Lights", "The Weeknd",
                                "Matches your love for high-energy synth-pop hooks."),
                        new CurationResponse.Recommendation("Bohemian Rhapsody", "Queen",
                                "An essential masterpiece of theatrical vocal ranges and rock shifts."),
                        new CurationResponse.Recommendation("Bad Guy", "Billie Eilish",
                                "A dark, bass-heavy alt-pop texture to diversify your playlist."),
                        new CurationResponse.Recommendation("Get Lucky", "Daft Punk",
                                "A timeless dance-funk groove that coordinates with your upbeat entries."),
                        new CurationResponse.Recommendation("Stay", "The Kid LAROI & Justin Bieber",
                                "A fast-tempo vocal hook that mirrors your pop-oriented selections.")),
                true);
    }
}
