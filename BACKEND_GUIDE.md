# Backend guide for beginners

## What you are looking at

`backend/` is a self-contained Spring Boot application. Spring Boot starts a Java web server, maps HTTP requests to Java methods, and talks to the database for us.

```
Browser or API client
        |
        v
Controller -> Service -> Repository -> H2 database
                 |
                 +-> iTunes Search API (only for /api/search)
```

The frontend will later call these HTTP endpoints. For now, use PowerShell or Postman to test them.

## Important folders

| Path | Role |
| --- | --- |
| `backend/pom.xml` | Maven dependencies and Java/Spring Boot version |
| `src/main/java/.../controller` | HTTP endpoints: request in, JSON response out |
| `src/main/java/.../service` | Application rules and integrations |
| `src/main/java/.../model` | The `AppUser` and `Album` database table definitions |
| `src/main/java/.../repository` | Database access interface |
| `src/main/java/.../dto` | Request/response shapes and validation rules |
| `src/main/java/.../security` | JWT creation and verification |
| `src/main/java/.../service/AnalyticsService.java` | Builds chart-ready metrics from the signed-in user's library |
| `src/main/resources/application.yml` | Local configuration |
| `src/test` | Automated tests |

## Prerequisites

1. Install Java 21 or newer. Verify with `java -version`.
2. Install Maven 3.9 or newer. Verify with `mvn -version`.
3. Open a PowerShell terminal in this repository.

## Run it

```powershell
cd backend
mvn spring-boot:run
```

Wait for a message saying the application started. Stop it with `Ctrl+C`.

On first run, H2 creates files under `backend/data/`. These are ignored by Git because they are your local library data.

Whenever you change Java or YAML files, stop the running server with `Ctrl+C` and run `mvn spring-boot:run` again. The server does not automatically use source-code edits made while it is already running.

This version adds user ownership to saved albums. If you already created the H2 database with an older version of this project and startup reports an `albums.user_id` or unique-constraint error, stop the server and remove only the local development database files in `backend/data/`, then start again. This resets local library data; it does not affect the public iTunes catalog.

## Test it manually

### 0. Confirm the server is healthy

```powershell
Invoke-RestMethod 'http://localhost:8080/api/health'
```

Expected result:

```text
status
------
UP
```

If this does not return `UP`, do not continue: the backend is not running on port 8080 yet.

### 1. Register an account and get a token

Usernames must be 3-50 characters using letters, numbers, `_`, or `-`. Passwords must be at least 8 characters. Passwords are saved as BCrypt hashes, never as plain text.

```powershell
$registration = Invoke-RestMethod -Method Post `
  -Uri 'http://localhost:8080/api/auth/register' `
  -ContentType 'application/json' `
  -Body '{"username":"alice","password":"secure-password-123"}'
$token = $registration.token
$headers = @{ Authorization = "Bearer $token" }
```

Expected result: `$token` should contain a long string with three dot-separated sections. If it is blank, the registration request did not succeed.

To sign in again later instead of registering the same username twice:

```powershell
$login = Invoke-RestMethod -Method Post `
  -Uri 'http://localhost:8080/api/auth/login' `
  -ContentType 'application/json' `
  -Body '{"username":"alice","password":"secure-password-123"}'
$token = $login.token
$headers = @{ Authorization = "Bearer $token" }
```

### 2. Search the public catalog

```powershell
# Default search (returns first 12 items, cached in-memory and sliced)
Invoke-RestMethod 'http://localhost:8080/api/search?query=coldplay&type=album'

# Paginated search (retrieves specific pages from the 200-item cached batch)
Invoke-RestMethod 'http://localhost:8080/api/search?query=coldplay&type=album&page=1&size=12'
```

Expected result: a list of albums. Each item has an `appleCatalogId`, `title`, and `artistName`. The search endpoint retrieves a full batch of 200 results from iTunes, caches them in-memory to prevent rate-limiting, and slices them using the `page` and `size` parameters to bypass Apple's lack of `offset` support.

If search reports `502 Bad Gateway`, your backend is running correctly but Apple's public catalog is temporarily rejecting or unavailable to the request. Try again later.

### 3. Save an album

```powershell
$body = @{
  appleCatalogId = 1440806041
  title = 'Parachutes'
  artistName = 'Coldplay'
  genre = 'Alternative'
  releaseDate = '2000-07-10'
  trackCount = 10
  artworkUrl = 'https://example.com/parachutes.jpg'
  userRating = 5
  userNotes = 'A favourite album.'
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri 'http://localhost:8080/api/library' `
  -Headers $headers -ContentType 'application/json' -Body $body
```

Expected result: the returned album contains an `id`, plus `createdAt` and `updatedAt`. That confirms the database write succeeded.

### 4. Read, update, and delete

```powershell
# Get all saved albums (unpaginated list wrapper for backward compatibility)
Invoke-RestMethod 'http://localhost:8080/api/library' -Headers $headers

# Get a paginated page of saved albums (formatted with page count, elements count metadata)
Invoke-RestMethod 'http://localhost:8080/api/library?page=0&size=12' -Headers $headers

Invoke-RestMethod -Method Put -Uri 'http://localhost:8080/api/library/1' `
  -Headers $headers -ContentType 'application/json' `
  -Body ($body | ConvertFrom-Json | ForEach-Object { $_.userRating = 4; $_ } | ConvertTo-Json)

Invoke-RestMethod -Method Delete 'http://localhost:8080/api/library/1' -Headers $headers
```

Replace `1` with the ID returned by the save request.

Expected results:

- The first library request returns the album you saved (or `[]` before saving anything).
- The update request returns the same album with `userRating` set to `4`.
- Delete does not print a response body. Run the library request again; the deleted album should no longer be present. This is the confirmation that deletion succeeded.

### 5. View analytics data

Save at least two or three albums first, ideally with different genres, years, artists, and ratings. Then run:

```powershell
Invoke-RestMethod 'http://localhost:8080/api/analytics' -Headers $headers | ConvertTo-Json -Depth 5
```

Expected result: one JSON object containing:

- `summary`: saved-album count, distinct artists/genres, total tracks, and average rating.
- `genreDistribution`: pie/donut chart data.
- `releasesByYear`: line chart data, sorted by year.
- `ratingsDistribution`: bar chart data with all one-to-five-star buckets.
- `topArtists`: horizontal-bar chart data, up to ten artists.
- `trackCountHistogram`: histogram buckets: 0-5, 6-10, 11-15, and 16+ tracks.

All analytics data is user-scoped: the endpoint only includes the albums belonging to the account whose token appears in `$headers`.

## Manual test checklist

Everything is working when all of these are true:

- `/api/health` returns `UP`.
- Registering a new user returns a non-empty JWT token.
- Logging in with that username and password returns a new non-empty JWT token.
- Album search returns one or more catalog results.
- A valid save returns an album with a database `id`.
- The library list contains that album after saving.
- Updating changes the returned rating or notes.
- After deletion, the library list no longer contains that album.
- `/api/analytics` returns summary and all five chart datasets after albums are saved.
- Calling `/api/library` **without** `$headers` fails with `401 Unauthorized`; that proves the JWT protection is active.

## Prove user isolation

This verifies that protected endpoints do not merely require *any* token: they use the identity inside the token.

1. With Alice's `$headers`, save an album and remember its `id`.
2. Register a second user and replace `$headers` with Bob's token:

```powershell
$bob = Invoke-RestMethod -Method Post `
  -Uri 'http://localhost:8080/api/auth/register' `
  -ContentType 'application/json' `
  -Body '{"username":"bob","password":"another-secure-password"}'
$bobHeaders = @{ Authorization = "Bearer $($bob.token)" }
Invoke-RestMethod 'http://localhost:8080/api/library' -Headers $bobHeaders
```

Expected result: Bob receives `[]`, even though Alice saved an album. Also try replacing the ID below with Alice's album ID:

```powershell
Invoke-RestMethod -Method Delete 'http://localhost:8080/api/library/1' -Headers $bobHeaders
```

Expected result: `404 Not Found`. A user cannot read, update, or delete another user's albums. Replace `1` with Alice's actual album ID.

## Run automated tests

In `backend/` run:

```powershell
mvn test
```

Tests use mocks, so they do not call the real iTunes API or write to your H2 database.

Expected result: Maven finishes with `BUILD SUCCESS`. The tests cover password hashing, duplicate-user rejection, user-scoped library operations, and public search security.

## Request flow example

For `POST /api/library`:

1. Spring Security checks the Bearer JWT before allowing the request.
2. `LibraryController` receives JSON and validates required fields and rating range.
3. `LibraryService` verifies the Apple catalog ID is not already saved.
4. `AlbumRepository` saves the `Album` entity to H2.
5. The controller returns `201 Created` and the saved album as JSON.

If validation fails, `GlobalExceptionHandler` returns a useful JSON error and a `400` status. Missing albums return `404`; duplicate Apple IDs return `409`.

## Common issues

- **`mvn` is not recognized:** install Maven, then open a new terminal.
- **Port 8080 is already in use:** stop the other application or change `server.port` in `application.yml`.
- **401 Unauthorized:** register or log in again and send the returned token as `Authorization: Bearer <token>`.
- **409 Conflict while registering:** that username already exists; use a different username or use `/api/auth/login`.
- **Search fails:** check your internet connection; the endpoint needs to reach Apple's public iTunes API.
