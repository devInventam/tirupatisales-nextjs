import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductItem } from "@/types";

interface UIState {
  mobileMenuOpen: boolean;
  notificationPopupDismissed: boolean;
  selectedProduct: ProductItem | null;
  productModalOpen: boolean;
}

const initialState: UIState = {
  mobileMenuOpen: false,
  notificationPopupDismissed: false,
  selectedProduct: null,
  productModalOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    dismissNotificationPopup: (state) => {
      state.notificationPopupDismissed = true;
    },
    openProductModal: (state, action: PayloadAction<ProductItem>) => {
      state.selectedProduct = action.payload;
      state.productModalOpen = true;
    },
    closeProductModal: (state) => {
      state.productModalOpen = false;
      state.selectedProduct = null;
    },
  },
});

export const {
  setMobileMenuOpen,
  toggleMobileMenu,
  dismissNotificationPopup,
  openProductModal,
  closeProductModal,
} = uiSlice.actions;

export default uiSlice.reducer;
