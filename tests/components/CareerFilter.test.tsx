import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CareerClientView } from "@/components/career/CareerClientView";
import { Job } from "@/types";

const mockJobs: Job[] = [
  {
    id: 1,
    documentId: "1",
    type: "Full Time",
    title: "Senior Switchgear Sales Engineer",
    department: "Sales",
    location: "Surat",
    blurb: "Drive switchgear solutions for industrial clients.",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
  },
  {
    id: 2,
    documentId: "2",
    type: "Full Time",
    title: "Field Electrical Technician",
    department: "Electrical Service",
    location: "Ahmedabad",
    blurb: "On-site testing and commissioning of control panels.",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
  },
];

describe("CareerClientView Component", () => {
  it("renders job cards and department/location filter selects", () => {
    render(<CareerClientView initialJobs={mockJobs} />);

    expect(screen.getByText("Senior Switchgear Sales Engineer")).toBeInTheDocument();
    expect(screen.getByText("Field Electrical Technician")).toBeInTheDocument();
    expect(screen.getByLabelText(/department:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location:/i)).toBeInTheDocument();
  });

  it("filters job list when department select is changed", () => {
    render(<CareerClientView initialJobs={mockJobs} />);

    const deptSelect = screen.getByLabelText(/department:/i) as HTMLSelectElement;
    fireEvent.change(deptSelect, { target: { value: "Sales" } });

    expect(screen.getByText("Senior Switchgear Sales Engineer")).toBeInTheDocument();
    expect(screen.queryByText("Field Electrical Technician")).not.toBeInTheDocument();
  });
});
