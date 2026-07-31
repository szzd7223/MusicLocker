# Music Catalog Insights Platform

This repository is the starting point for the Ledger CFO take-home assignment.

## Current scope

The project focuses on **songs**. Songs represent the most granular, popular, and interactive unit of a music catalog. Focusing on individual songs allows users to track their precise listening preferences (track duration), score single tracks, and get more focused analytics on specific songs rather than general albums.

### Pivot from Albums to Songs
Initially, the project was designed to catalog entire albums. However, to create a more direct, track-level personal music log, I pivoted the scope from albums to individual songs:
*   **Granularity:** Users often rate and log notes for single tracks rather than whole collections.
*   **Track Length Analytics:** Focusing on songs lets us analyze track duration distributions (e.g., short tracks under 3 minutes, medium tracks, long tracks) which is more telling than album track counts.
*   **Integration:** The public iTunes Search API is queried for `type=song` (returning track items) instead of `type=album` (returning collection items).

### Included

- Spring Boot REST API in `backend/`
- iTunes Search API proxy for song search (cached and sliced in-memory)
- H2 file-backed SQL database for a local saved library of songs
- User registration and BCrypt-hashed passwords
- JWT-protected, user-owned library CRUD endpoints for songs
- User-scoped analytics API with five song-related datasets (genre, release year, rating, artists, and duration bins)
- **AI Music Curator:** Generates a custom music archetype, a friendly critique, and 5 track recommendations based on the user's library using the `gemini-3.5-flash-lite` model.
- Validation and centralized JSON error responses
- Service-level tests for song repository and CRUD services
- Next.js UI including real-time debounced search, rating dialog, library grid pagination, and dashboard analytics

---

## Database choice

The local development database is **H2**, a relational SQL database stored in a file. It is zero-configuration for a beginner while preserving the same JPA/SQL modelling that can move to PostgreSQL for production. Only saved songs are stored; iTunes search results are fetched live and are not persisted until the user saves one.

---

## Quick start

See [BACKEND_GUIDE.md](BACKEND_GUIDE.md) and [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md) for step-by-step setup and testing instructions.

From the repository root:

```powershell
cd backend
mvn spring-boot:run
```

The API starts at `http://localhost:8080`. Confirm the backend is running:

```powershell
Invoke-RestMethod http://localhost:8080/api/health
```

It should return `status: UP`. Then create an account; the response includes a JWT:

```powershell
Invoke-RestMethod -Method Post http://localhost:8080/api/auth/register -ContentType 'application/json' -Body '{"username":"alice","password":"secure-password-123"}'
```

Use the returned `token` as a Bearer token for `/api/library` requests.

---

## API overview

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Create an account and obtain a JWT | No |
| POST | `/api/auth/login` | Sign in and obtain a JWT | No |
| GET | `/api/search?query=coldplay&type=song` | Search the public iTunes song catalog (cached/sliced) | No |
| GET | `/api/library` | List/Paginate the current user's saved songs | Yes |
| POST | `/api/library` | Save a song | Yes |
| PUT | `/api/library/{id}` | Update saved song rating or notes | Yes |
| DELETE | `/api/library/{id}` | Remove a saved song | Yes |
| GET | `/api/analytics` | Summary metrics and five chart datasets for the current user's library | Yes |
| GET | `/api/curator` | Retrieve AI Curator analysis and recommendations (utilizing `gemini-3.5-flash-lite`) | Yes |

---

## Assignment alignment

- Focus: Songs, stated above with rationale.
- Schema: all requested saved-library fields are represented in the `Song` entity:
  - `id`, `apple_catalog_id` (trackId), `title` (trackName), `artist_name`, `genre`, `release_date`, `duration` (trackTimeMillis), `artwork_url`, `user_rating`, `user_notes`, `created_at`, `updated_at`.
- API: required search and CRUD routes, REST status codes, validation, and centralized errors are included.
- Authentication: BCrypt-hashed local accounts and JWT bearer-token authentication protect library reads and mutations; each user can access only their own songs.
- Analytics: the backend exposes genre, release-year, ratings, artist, and song-duration datasets for the dashboard.
- **AI Feature:** Widescreen interactive Curator Card on the dashboard generating musical personas and 5 custom track recommendations based on saved songs (utilizing `gemini-3.5-flash-lite`).

The search endpoint supports `type=song` only because songs are the declared focus.

---

## Challenges Faced

During the implementation of advanced performance and pagination features, I encountered and resolved several notable technical challenges:

### 1. The iTunes Search API "Offset" Fiasco
*   **The Problem:** I wanted to implement search pagination to optimize page sizes and prevent layout gaps on the frontend. The iTunes Search API is widely rumored in community forums to support an `offset` parameter for skipping items. However, during live testing, I found that Apple's endpoint completely ignores the `offset` query parameter when searching, returning the exact same first-page results even for `offset=12` or `offset=24`.
*   **The Fix:** I implemented a server-side slicing mechanism on the backend. The `ItunesSearchService` now fetches a larger batch of up to 40 items (the maximum limit supported by Apple) in a single request, caches the full list, and the `SearchController` dynamically slices the cached results in-memory using `allResults.subList(fromIndex, toIndex)` based on the requested `page` and `size`. This makes search page switches instantaneous, completely resolves the duplicate results issue, and drastically reduces round-trip latency.

### 2. Upstream Rate Limiting & Caching
*   **The Problem:** The iTunes Search API is rate-limited to about 20 requests per minute. With active searching, this threshold is easily breached, leading to `429 Too Many Requests` upstream errors.
*   **The Fix:** I integrated Spring Boot's `@Cacheable` abstraction on the search service. Combined with the 200-item batch fetching mentioned above, searches for the same keyword are cached locally in memory. This reduces duplicate requests to the iTunes API to near-zero, keeping the application fast and resilient.

### 3. Front-End API Spamming & Debounced Search
*   **The Problem:** Originally, catalog searches only ran on manual form submissions. When making it feel reactive, a naive search implementation would fire an API call for every keystroke. This causes high network overhead, sluggish UI response times, and race conditions where older requests complete after newer ones.
*   **The Fix:** I built a custom 500ms debouncing hook in Next.js (`frontend/app/page.tsx`). The application buffers user input and only fires the search request 500ms after the user stops typing, saving network bandwidth and creating a smooth, responsive user interface.
