export type ChartPoint = { label: string; value: number };

export type Album = {
  id: number;
  appleCatalogId: number;
  title: string;
  artistName: string;
  genre?: string | null;
  releaseDate?: string | null;
  trackCount?: number | null;
  artworkUrl?: string | null;
  userRating?: number | null;
  userNotes?: string | null;
};

export type SearchAlbum = Omit<Album, "id" | "userRating" | "userNotes">;

export type Analytics = {
  summary: {
    savedAlbums: number;
    distinctArtists: number;
    distinctGenres: number;
    totalTracks: number;
    averageUserRating: number | null;
  };
  genreDistribution: ChartPoint[];
  releasesByYear: ChartPoint[];
  ratingsDistribution: ChartPoint[];
  topArtists: ChartPoint[];
  trackCountHistogram: ChartPoint[];
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
