# Music Catalog Insights Platform - Project Progress

This file serves as the single source of truth for the project requirements, current implementation progress, and outstanding tasks. It is formatted as a structured checklist for easy reference by development agents.

## 🎯 Focus Choice
- [x] Select focus entity: **Albums**
- [x] Document entity choice and justification in README.md

---

## 💾 1. Database & Schema
- [x] Relational database configuration (currently using **H2** local file-backed database)
- [x] Document database choice and justification in README.md
- [x] Schema implementation with user isolation and matching fields:
  - [x] `id`
  - [x] `apple_catalog_id`
  - [x] `title`
  - [x] `artist_name`
  - [x] `genre`
  - [x] `release_date`
  - [x] `track_count`
  - [x] `artwork_url`
  - [x] `user_rating`
  - [x] `user_notes`
  - [x] `created_at`
  - [x] `updated_at`
  - [x] User ownership / foreign key reference (`user_id`)

---

## 🔌 2. REST API Requirements
- [x] `GET /api/search?query=...&type=...` (iTunes proxy query endpoint)
- [x] `GET /api/library` (list current user's saved items)
- [x] `POST /api/library` (save new item to user's library)
- [x] `PUT /api/library/{id}` (update user-specific ratings/notes)
- [x] `DELETE /api/library/{id}` (remove item from user's library)
- [x] CENTRALIZED exception handler mapped to standardized JSON errors
- [x] Request parameter and DTO validation rules
- [x] User authentication and registration (local passwords hashed with BCrypt)
- [x] JWT bearer authentication protecting library endpoints
- [x] User-scoped analytics endpoint (`GET /api/analytics`) exposing:
  - [x] Summary metrics (counts, average rating)
  - [x] Genre distribution
  - [x] Release years
  - [x] Rating distribution
  - [x] Top artists
  - [x] Track count distribution (histogram)

---

## 🎨 3. Frontend / UI Requirements
- [x] Next.js (App Router) project environment configured with TailwindCSS / Vanilla CSS
- [x] Curated retro aesthetic with Light and Dark themes
- [x] Search page (Discover tab live calling backend iTunes proxy search)
- [x] Library page (Library tab displaying items with inline note/rating editors)
- [x] Analytics Dashboard tab showcasing charts
- [x] Responsive layout with loading lines/indicators and blank/empty library layouts

---

## 📊 4. Analytics Dashboard Charts
- [x] Implement at least 4 distinct chart visualizations:
  - [x] Pie Chart: Genre distribution
  - [x] Line Chart: Releases through time (by year)
  - [x] Bar Chart: Rating distribution
  - [x] Horizontal Bar Chart: Top artists
  - [x] Histogram/Bar Chart: Track count ranges

---

## 🤖 5. AI Feature (Pending)
- [ ] Implement ONE AI-driven catalog feature. Candidates:
  - `[ ]` AI recommendations based on saved library
  - `[ ]` Natural language querying of the library
  - `[ ]` Taste/trend summary generation (Text analysis)
  - `[ ]` Duplicate/similar track detection

---

## 🌐 6. Deployment (Pending)
- [ ] Setup production deployment configs (Dockerfiles, server ports, or environment variables)
- [ ] Deploy Backend application (e.g., Render, Railway, AWS)
- [ ] Deploy Frontend application (e.g., Vercel, Netlify)
- [ ] Update live URLs in README and configuration files

---

## 🌟 7. Good to Have & Optimization Tasks
- [x] Service-level automated tests in Backend (e.g., `mvn test` integration)
- [x] Search API Caching (e.g., Spring Cache on external iTunes search query)
- [x] API Pagination (on library lists and search results with 12-item grid alignment)
- [x] Debounced Search (real-time keyup query debouncing on the frontend UI)

---

## 📦 8. Deliverables Checklist
- [ ] Live functioning website / APIs
- [ ] README.md updated with live site URLs, installation commands, trade-offs, and details
- [x] GitHub Repository with complete commit history
