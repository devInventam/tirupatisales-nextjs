import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContactForm } from "@/components/contact/ContactForm";

describe("ContactForm Component", () => {
  it("renders all required input fields", () => {
    render(<ContactForm />);

    expect(screen.getByPlaceholderText(/rajesh patel/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/apex electrical/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/\+91 98765/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contact@company.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send inquiry/i })).toBeInTheDocument();
  });

  it("updates input field values on change", () => {
    render(<ContactForm />);

    const nameInput = screen.getByPlaceholderText(/rajesh patel/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Amit Verma" } });
    expect(nameInput.value).toBe("Amit Verma");

    const emailInput = screen.getByPlaceholderText(/contact@company.com/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "amit@verma.com" } });
    expect(emailInput.value).toBe("amit@verma.com");
  });
});
