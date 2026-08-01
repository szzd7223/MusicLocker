import { useState, useEffect, FormEvent } from "react";
import { SearchSong } from "../types";
import { apiRequest } from "../utils/api";

interface UseSearchOptions {
  token: string | null;
  logout: () => void;
  setNotice: (msg: string, type?: "success" | "error", duration?: number) => void;
}

export function useSearch({ token, logout, setNotice }: UseSearchOptions) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [results, setResults] = useState<SearchSong[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(0);

  // Handle catalog search debouncing
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Execute catalog search when debounced term changes
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setResults([]);
      return;
    }
    void executeSearchQuery(debouncedSearch, 0);
  }, [debouncedSearch]);

  async function executeSearchQuery(queryText: string, targetPage = 0) {
    if (!queryText.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    setNotice("");
    try {
      const data = (await apiRequest(
        `/api/search?query=${encodeURIComponent(queryText.trim())}&type=song&page=${targetPage}&size=12`,
        {},
        token,
        logout
      )) as SearchSong[];
      setResults(data);
      setSearchPage(targetPage);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Search failed.", "error");
    } finally {
      setSearching(false);
    }
  }

  function runSearch(event: FormEvent) {
    event.preventDefault();
    if (!search.trim()) return;
    setDebouncedSearch(search);
    void executeSearchQuery(search, 0);
  }

  return {
    search,
    setSearch,
    debouncedSearch,
    setDebouncedSearch,
    results,
    setResults,
    searching,
    searchPage,
    executeSearchQuery,
    runSearch,
  };
}
