# Music Catalog Insights Platform

This repository is the starting point for the Ledger CFO take-home assignment.

## Current scope

The project deliberately focuses on **albums**. Albums provide the most useful mix of fields for a personal music library: artist, genre, release date, number of tracks, and artwork. The backend is implemented now; `frontend/` is reserved for a future Next.js application and intentionally contains no application files.

### Included

- Spring Boot REST API in `backend/`
- iTunes Search API proxy for album search
- H2 file-backed SQL database for a local saved library
- User registration and BCrypt-hashed passwords
- JWT-protected, user-owned library CRUD endpoints
- User-scoped analytics API with five chart-ready datasets
- Validation and centralized JSON error responses
- Service-level tests

### Deferred for later phases

- Next.js UI, including search, library, and responsive loading/empty states
- Four analytics charts
- AI insight feature
- Deployment, pagination, caching, and debounced search

## Database choice

The local development database is **H2**, a relational SQL database stored in a file. It is zero-configuration for a beginner while preserving the same JPA/SQL modelling that can move to PostgreSQL for production. Only saved albums are stored; iTunes search results are fetched live and are not persisted until the user saves one.

## Quick start

See [BACKEND_GUIDE.md](BACKEND_GUIDE.md) for step-by-step setup and testing instructions.

From the repository root:

```powershell
cd backend
mvn spring-boot:run
```

The API starts at `http://localhost:8080`. First confirm the backend is running:

```powershell
Invoke-RestMethod http://localhost:8080/api/health
```

It should return `status: UP`. Then create an account; the response includes a JWT:

```powershell
Invoke-RestMethod -Method Post http://localhost:8080/api/auth/register -ContentType 'application/json' -Body '{"username":"alice","password":"secure-password-123"}'
```

Use the returned `token` as a Bearer token for `/api/library` requests.

## API overview

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Create an account and obtain a JWT | No |
| POST | `/api/auth/login` | Sign in and obtain a JWT | No |
| GET | `/api/search?query=coldplay&type=album` | Search the public iTunes album catalog | No |
| GET | `/api/library` | List the current user's saved albums | Yes |
| POST | `/api/library` | Save an album | Yes |
| PUT | `/api/library/{id}` | Update saved album metadata | Yes |
| DELETE | `/api/library/{id}` | Remove a saved album | Yes |
| GET | `/api/analytics` | Summary metrics and five chart datasets for the current user's library | Yes |

## Assignment alignment

- Focus: Albums, stated above with rationale.
- Schema: all requested saved-library fields are represented in the `Album` entity.
- API: required search and CRUD routes, REST status codes, validation, and centralized errors are included.
- Authentication: BCrypt-hashed local accounts and JWT bearer-token authentication protect library reads and mutations; each user can access only their own albums.
- Analytics: the backend exposes genre, release-year, ratings, artist, and track-count datasets for the dashboard.

The search endpoint supports `type=album` only because albums are the declared focus.

## Challenges Faced

During the implementation of advanced performance and pagination features, I encountered and resolved several notable technical challenges:

### 1. The iTunes Search API "Offset" Fiasco
*   **The Problem:** I wanted to implement search pagination to optimize page sizes and prevent layout gaps on the frontend. The iTunes Search API is widely rumored in community forums to support an `offset` parameter for skipping items. However, during live testing, I found that Apple's endpoint completely ignores the `offset` query parameter when searching, returning the exact same first-page results even for `offset=12` or `offset=24`.
*   **The Fix:** I implemented a server-side slicing mechanism on the backend. The `ItunesSearchService` now fetches a larger batch of up to 200 items (the maximum limit supported by Apple) in a single request, caches the full list, and the `SearchController` dynamically slices the cached results in-memory using `allResults.subList(fromIndex, toIndex)` based on the requested `page` and `size`. This makes search page switches instantaneous, completely resolves the duplicate results issue, and drastically reduces round-trip latency.

### 2. Upstream Rate Limiting & Caching
*   **The Problem:** The iTunes Search API is rate-limited to about 20 requests per minute. With active searching, this threshold is easily breached, leading to `429 Too Many Requests` upstream errors.
*   **The Fix:** I integrated Spring Boot's `@Cacheable` abstraction on the search service. Combined with the 200-item batch fetching mentioned above, searches for the same keyword are cached locally in memory. This reduces duplicate requests to the iTunes API to near-zero, keeping the application fast and resilient.

### 3. Front-End API Spamming & Debounced Search
*   **The Problem:** Originally, catalog searches only ran on manual form submissions. When making it feel reactive, a naive search implementation would fire an API call for every keystroke. This causes high network overhead, sluggish UI response times, and race conditions where older requests complete after newer ones.
*   **The Fix:** I built a custom 500ms debouncing hook in Next.js (`frontend/app/page.tsx`). The application buffers user input and only fires the search request 500ms after the user stops typing, saving network bandwidth and creating a smooth, responsive user interface.
