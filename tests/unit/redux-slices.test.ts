import { describe, it, expect } from "vitest";
import searchReducer, {
  setSearchQuery,
  setSearchOpen,
  addRecentSearch,
  clearRecentSearches,
} from "@/store/slices/searchSlice";
import uiReducer, {
  toggleMobileMenu,
  setMobileMenuOpen,
  openProductModal,
  closeProductModal,
  dismissNotificationPopup,
} from "@/store/slices/uiSlice";
import { ProductItem } from "@/types";

const mockProductItem: ProductItem = {
  id: "prod-42",
  name: "MasterPact NW ACB",
  brand: "Schneider Electric",
  images: ["/test.jpg"],
  pageUrl: "/category/switchgear/air-circuit-breakers",
  title: "MasterPact NW ACB",
  description: "Low voltage power circuit breaker.",
  specs: { Rating: "1600A" },
  price: "Price on Request",
  technicalData: { Rating: "1600A" },
  application: ["Main switchboard"],
  properties: ["Reliable"],
  keyFeatures: ["Micrologic trip unit"],
  pdfLinks: [],
  subcategorySlug: "air-circuit-breakers",
};

describe("Redux State Slices", () => {
  describe("searchSlice", () => {
    it("should handle initial state", () => {
      const state = searchReducer(undefined, { type: "unknown" });
      expect(state.query).toBe("");
      expect(state.isOpen).toBe(false);
      expect(Array.isArray(state.recentSearches)).toBe(true);
    });

    it("should update query and open/close modal", () => {
      let state = searchReducer(undefined, setSearchQuery("switchgear"));
      expect(state.query).toBe("switchgear");

      state = searchReducer(state, setSearchOpen(true));
      expect(state.isOpen).toBe(true);

      state = searchReducer(state, setSearchOpen(false));
      expect(state.isOpen).toBe(false);
    });

    it("should manage recent searches deduplication", () => {
      let state = searchReducer(undefined, addRecentSearch("Schneider MCCB"));
      state = searchReducer(state, addRecentSearch("L&T Contactor"));
      state = searchReducer(state, addRecentSearch("Schneider MCCB")); // Duplicate
      expect(state.recentSearches[0]).toBe("Schneider MCCB");
      expect(state.recentSearches.length).toBe(2);

      state = searchReducer(state, clearRecentSearches());
      expect(state.recentSearches.length).toBe(0);
    });
  });

  describe("uiSlice", () => {
    it("should toggle mobile menu", () => {
      let state = uiReducer(undefined, toggleMobileMenu());
      expect(state.mobileMenuOpen).toBe(true);

      state = uiReducer(state, setMobileMenuOpen(false));
      expect(state.mobileMenuOpen).toBe(false);
    });

    it("should open and close product detail modal", () => {
      let state = uiReducer(undefined, openProductModal(mockProductItem));
      expect(state.selectedProduct?.id).toBe("prod-42");
      expect(state.productModalOpen).toBe(true);

      state = uiReducer(state, closeProductModal());
      expect(state.selectedProduct).toBeNull();
      expect(state.productModalOpen).toBe(false);
    });

    it("should dismiss notification popup", () => {
      let state = uiReducer(undefined, dismissNotificationPopup());
      expect(state.notificationPopupDismissed).toBe(true);
    });
  });
});
