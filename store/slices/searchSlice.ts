import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchProduct } from "@/types";

const RECENT_SEARCHES_KEY = "tsc_recent_searches";

function getInitialRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

interface SearchState {
  isOpen: boolean;
  query: string;
  results: SearchProduct[];
  isLoading: boolean;
  recentSearches: string[];
}

const initialState: SearchState = {
  isOpen: false,
  query: "",
  results: [],
  isLoading: false,
  recentSearches: [],
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
      if (!action.payload) {
        state.query = "";
        state.results = [];
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<SearchProduct[]>) => {
      state.results = action.payload;
      state.isLoading = false;
    },
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loadRecentSearches: (state) => {
      state.recentSearches = getInitialRecentSearches();
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const term = action.payload.trim();
      if (!term) return;
      const updated = [term, ...state.recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 7);
      state.recentSearches = updated;
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage error
      }
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      const updated = state.recentSearches.filter((s) => s !== action.payload);
      state.recentSearches = updated;
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage error
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      try {
        localStorage.removeItem(RECENT_SEARCHES_KEY);
      } catch {
        // ignore storage error
      }
    },
  },
});

export const {
  setSearchOpen,
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
  loadRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} = searchSlice.actions;

export default searchSlice.reducer;
