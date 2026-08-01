import { useState, FormEvent } from "react";
import { Song, Analytics, Curation, PageResponse, SearchSong } from "../types";
import { apiRequest } from "../utils/api";

interface UseLibraryOptions {
  token: string | null;
  logout: () => void;
  setNotice: (msg: string, type?: "success" | "error") => void;
  setTab: (tab: "overview" | "discover" | "library") => void;
}

export function useLibrary({ token, logout, setNotice, setTab }: UseLibraryOptions) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [libraryPage, setLibraryPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [curation, setCuration] = useState<Curation | null>(null);
  const [generatingCuration, setGeneratingCuration] = useState(false);
  const [loading, setLoading] = useState(false);

  // Transient save dialog states
  const [selected, setSelected] = useState<SearchSong | null>(null);
  const [rating, setRating] = useState(4);
  const [notes, setNotes] = useState("");

  function clearLibraryState() {
    setSongs([]);
    setAnalytics(null);
    setCuration(null);
  }

  async function refresh(accessToken = token, targetPage = libraryPage) {
    if (!accessToken) return;
    setLoading(true);
    try {
      let pageToFetch = targetPage;
      let libraryData = (await apiRequest(
        `/api/library?page=${pageToFetch}&size=12`,
        {},
        accessToken,
        logout
      )) as PageResponse<Song>;

      // If we are on a page that is now empty (e.g. due to deletes), pull the previous page
      if (libraryData.content.length === 0 && pageToFetch > 0) {
        pageToFetch = pageToFetch - 1;
        libraryData = (await apiRequest(
          `/api/library?page=${pageToFetch}&size=12`,
          {},
          accessToken,
          logout
        )) as PageResponse<Song>;
      }

      const insight = (await apiRequest("/api/analytics", {}, accessToken, logout)) as Analytics;

      setSongs(libraryData.content);
      setTotalPages(libraryData.totalPages);
      setLibraryPage(libraryData.pageNumber);
      setTotalElements(libraryData.totalElements);
      setAnalytics(insight);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load your library.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function generateCuration() {
    if (!token) return;
    setGeneratingCuration(true);
    setNotice("");
    try {
      const data = (await apiRequest("/api/curator", {}, token, logout)) as Curation;
      setCuration(data);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Curator generation failed.", "error");
    } finally {
      setGeneratingCuration(false);
    }
  }

  async function saveSelected(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setLoading(true);
    try {
      await apiRequest(
        "/api/library",
        {
          method: "POST",
          body: JSON.stringify({ ...selected, userRating: rating, userNotes: notes }),
        },
        token,
        logout
      );
      const savedTitle = selected.title;
      setSelected(null);
      setNotes("");
      setNotice(`Saved ${savedTitle} to your library.`);
      await refresh(token, 0);
      setTab("library");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save this song.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function updateSong(song: Song, patch: Partial<Song>) {
    setLoading(true);
    try {
      await apiRequest(
        `/api/library/${song.id}`,
        {
          method: "PUT",
          body: JSON.stringify({ ...song, ...patch }),
        },
        token,
        logout
      );
      setNotice("Song details updated.");
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not update song.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function removeSong(song: Song) {
    setLoading(true);
    try {
      await apiRequest(`/api/library/${song.id}`, { method: "DELETE" }, token, logout);
      setNotice("Song removed.");
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not remove song.", "error");
    } finally {
      setLoading(false);
    }
  }

  return {
    songs,
    setSongs,
    libraryPage,
    setLibraryPage,
    totalPages,
    totalElements,
    analytics,
    curation,
    generatingCuration,
    loading,
    selected,
    setSelected,
    rating,
    setRating,
    notes,
    setNotes,
    clearLibraryState,
    refresh,
    generateCuration,
    saveSelected,
    updateSong,
    removeSong,
  };
}
