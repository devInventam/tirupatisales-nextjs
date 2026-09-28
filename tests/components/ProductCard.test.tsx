import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductItem } from "@/types";

const mockProduct: ProductItem = {
  id: "prod-101",
  name: "MasterPact MTZ ACB 1600A",
  brand: "Schneider Electric",
  images: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31"],
  pageUrl: "/category/switchgear/air-circuit-breakers",
  title: "MasterPact MTZ ACB 1600A",
  description: "High-performance air circuit breaker for industrial plants.",
  specs: {
    Rating: "1600A",
    Poles: "3P / 4P",
  },
  price: "Price on Request",
  technicalData: {
    "Rated Current": "1600A",
  },
  application: ["Distribution Panels"],
  properties: ["Compact", "Class 1 Metering"],
  keyFeatures: ["Embedded Bluetooth"],
  pdfLinks: ["https://example.com/brochure.pdf"],
  subcategorySlug: "air-circuit-breakers",
};

describe("ProductCard Component", () => {
  it("renders product name, brand tag, and details button", () => {
    const handleOpenDetails = vi.fn();
    render(<ProductCard product={mockProduct} onOpenDetails={handleOpenDetails} />);

    expect(screen.getByText("MasterPact MTZ ACB 1600A")).toBeDefined();
    expect(screen.getByText("Schneider Electric")).toBeDefined();
  });

  it("triggers onOpenDetails when card click or details button is pressed", () => {
    const handleOpenDetails = vi.fn();
    render(<ProductCard product={mockProduct} onOpenDetails={handleOpenDetails} />);

    const card = screen.getByText("MasterPact MTZ ACB 1600A");
    fireEvent.click(card);

    expect(handleOpenDetails).toHaveBeenCalledWith(mockProduct);
  });
});
