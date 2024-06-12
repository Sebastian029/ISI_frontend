import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import TopBar from "../src/pages/Admin/TopBar/TopBar";

describe("TopBar", () => {
  it("should render navigation links and logout button", () => {
    render(
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>
    );

    const adminLink = screen.getByText(/Admin/i);

    expect(adminLink).toBeInTheDocument();
  });
});
