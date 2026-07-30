# Frontend Guide for Developers

This guide outlines the modular architecture, codebase structure, design aesthetics, and verification steps for the Next.js frontend application (`frontend/`).

---

## Architecture and Stack

The frontend is a single-page dashboard application running within a Next.js (App Router) environment. It maintains its global application states at the root page level while delegating presentation layouts to lightweight, modular components:

```
                  +----------------------------------------------+
                  |                app/layout.tsx                |
                  |  (Global HTML, body, and fonts loading)       |
                  +----------------------------------------------+
                                         |
                                         v
                  +----------------------------------------------+
                  |                 app/page.tsx                 |
                  |  (State Orchestrator, Auth, & CRUD Handlers) |
                  +----------------------------------------------+
                    /          |              \               \
                   /           |               \               \
                  v            v                v               v
    +------------+      +------------+    +------------+   +------------+
    | AuthScreen |      |  Overview  |    |  Discover  |   |  Library   |
    | (Log/Reg)  |      |  (Charts)  |    |  (Search)  |   |  (Shelves) |
    +------------+      +------------+    +------------+   +------------+
                              |                 |                |
                              v                 v                v
                       +------------+    +------------+   +------------+
                       | LegendLike |    | SaveDialog |   |LibraryCard |
                       | (Pie Key)  |    | (Rating px)|   | (Inline Ed)|
                       +------------+    +------------+   +------------+
                              ^                 |                |
                              |                 v                v
                       +------------+    +------------------------------+
                       | ChartCard  |    |          AlbumCard           |
                       | (Wrapper)  |    |   (Displays artwork/meta)    |
                       +------------+    +------------------------------+
```

### Core Technologies
- **Next.js 15 (App Router)**: Orchestrates routing and page setup.
- **React 19**: Manages interface components and local states.
- **Recharts**: Renders the 5 responsive analytic graphs using SVG.
- **Vanilla CSS (`globals.css`)**: Curates the retro vinyl layout (soft paper background, coral highlights, serif text, and floating spinning records).

---

## Codebase Directory Structure

The frontend code is structured into dedicated folders to ensure modularity, easy maintenance, and clean separation of concerns:

```text
frontend/
├── app/
│   ├── globals.css          # Global retro stylesheets, variable themes, animations
│   ├── layout.tsx           # Entry HTML structure, Google Fonts initialization
│   └── page.tsx             # Main client page - manages all state, fetch operations, and tab routing
├── components/              # Presentation components (isolated UI blocks)
│   ├── AlbumCard.tsx        # Base card rendering album metadata and covers using <Image />
│   ├── AuthScreen.tsx       # Auth panels (register/login) with spinning record animations
│   ├── ChartCard.tsx        # Styled wrapper for dashboard graphs
│   ├── Discover.tsx         # Catalog search tab interface
│   ├── LegendLike.tsx       # Custom responsive key guide for the Pie chart
│   ├── Library.tsx          # Saved album tab grid list layout
│   ├── LibraryCard.tsx      # Extended album card with inline score/notes editor form
│   ├── Overview.tsx         # Dashboard tab aggregating metric statistics & Recharts visualization
│   ├── SaveDialog.tsx       # Star rating modal for catalog additions
│   ├── TabButton.tsx        # Stylized tabs selectors
│   └── LegendLike.tsx       # Key for circular genres distribution
├── types/
│   └── index.ts             # Global TypeScript interface definitions (Album, Analytics, etc.)
└── utils/
    └── api.ts               # Core client configs (API baseURL, chart colors, apiError helper)
```

---

## Component Reference

Here is a breakdown of what does what:

### 1. State Orchestrator (`app/page.tsx`)
Acts as the single source of truth for all global states:
- Authenticated JWT token, username, and dark/light display settings.
- Active panel tabs (`overview` | `discover` | `library`).
- Array storage for the user's active library shelf and backend analytics data payloads.
- Handler callbacks: `request()` (intercepts `401 Unauthorized` errors to log out expired sessions), API calls for `refresh()`, user registration, searching iTunes, updating notes, and removing albums.

### 2. Core Tab Containers (`components/`)
- **`AuthScreen.tsx`**: Presents a split panel where the left side outlines the product storytelling with floating vintage album jackets, and the right side collects username/password info.
- **`Overview.tsx`**: Renders dynamic metric cards and feeds statistics into Recharts components (`PieChart` for genres, `LineChart` for historical timelines, `BarChart` for user score distributions, artist occurrences, and track length buckets).
- **`Discover.tsx`**: Renders a custom search bar with shortcut keyword suggestions (e.g. *Khruangbin*, *Radiohead*) and lists search items.
- **`Library.tsx`**: Displays saved albums. Replaced empty pages with catalog discovery call-to-actions.

### 3. Supporting Presentation Widgets
- **`AlbumCard.tsx`**: Handles album visuals, replacing standard `<img>` with Next.js optimized `<Image />` elements to allow smooth resizing.
- **`LibraryCard.tsx`**: Toggles local state to reveal inline sliders, star selectors, or input boxes where you can change ratings or journal entries.
- **`SaveDialog.tsx`**: A modal backdrop that overlays star buttons (`★`) and note text areas to customize record notes before saving.

---

## Look, Feel, and Design Aesthetics

The application layout is designed to feel premium, tactile, and responsive.

### Curated Color Palette & Glassmorphism
- **Light Theme**: A soft, organic warm-paper canvas background (`#fbf9f4`) paired with rich black ink text (`#191919`), warm coral highlights (`#ff7959`), mustard gold (`#e5b85e`), and minty green accents (`#73b6a2`).
- **Dark Theme**: Switches dynamically to a deep, soothing record-room midnight theme using dark grey tones, vibrant highlights, and custom opacity filters.
- **Translucent Overlays**: Star sliders and input frames use subtle background blurs and border drop shadows to resemble translucent physical overlays.

### Typography
Uses high-quality Google Fonts imported in `layout.tsx`:
- **`Playfair Display`**: A classic, high-contrast serif font used for header titles, branding logs, and callouts to emphasize an analog journal mood.
- **`DM Sans`**: A highly legible geometric sans-serif typeface handling descriptive text, labels, and forms.
- **`DM Mono`**: An elegant monospaced font dedicated to numbers, dates, statistics, and metadata counters.

### Micro-Animations
- **Spinning Vinyl Discs**: The authentication banner houses interactive SVG records that rotate infinitely (`@keyframes spin`).
- **Sliding Loading Line**: A glowing top indicator crawls across the header navbar whenever an API fetch request begins, disappearing immediately upon completion.
- **Smooth Fade-ins**: Transitioning tabs apply a `.fade-in` animation, transitioning opacity from 0 to 1 with a small translation to make the page load feel alive and fluid.

---

## How to Run, Test, and Verify the Frontend

### 1. Install Dependencies
Make sure you are in the `frontend` folder and run `pnpm install` in your powershell terminal:

```powershell
pnpm install
```

### 2. Run the Development Server
To launch the Next.js dev server locally, run the script:

```powershell
pnpm run dev
```

#### What confirms the start is correct:
- The terminal output shows:
  ```text
  ▲ Next.js 15.3.2
  - Local:        http://localhost:3000
  ```
- Navigating to `http://localhost:3000` will render the login page, where theme toggle triggers switch the stylesheet classes smoothly.

### 3. Build & Compile Checks
Verify that Next.js and TypeScript are completely satisfied with the new modular imports by executing the build script:

```powershell
pnpm run build
```

#### What confirms the build is successful:
- The compiler runs without TypeScript or ESLint errors.
- The command finishes with `0` exit code, producing route statistics similar to this:
  ```text
  Route (app)                              Size     First Load JS
  ┌ λ /                                    ... kB          ... kB
  └ ○ /_not-found                          ... kB          ... kB
  + First Load JS shared by all            ... kB
  ```
