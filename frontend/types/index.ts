export type ChartPoint = { label: string; value: number };

export type Song = {
  id: number;
  appleCatalogId: number;
  title: string;
  artistName: string;
  genre?: string | null;
  releaseDate?: string | null;
  duration?: number | null;
  artworkUrl?: string | null;
  userRating?: number | null;
  userNotes?: string | null;
};

export type SearchSong = Omit<Song, "id" | "userRating" | "userNotes">;

export type Analytics = {
  summary: {
    savedSongs: number;
    distinctArtists: number;
    distinctGenres: number;
    totalDuration: number;
    averageUserRating: number | null;
  };
  genreDistribution: ChartPoint[];
  releasesByYear: ChartPoint[];
  ratingsDistribution: ChartPoint[];
  topArtists: ChartPoint[];
  durationHistogram: ChartPoint[];
};

export type Recommendation = {
  title: string;
  artist: string;
  rationale: string;
};

export type Curation = {
  persona: string;
  summary: string;
  critique: string;
  recommendations: Recommendation[];
  isMock: boolean;
};

export type Tab = "overview" | "discover" | "library";
export type AuthMode = "login" | "register";

export type PageResponse<T> = {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};
