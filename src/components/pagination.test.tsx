import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pagination } from "@/components/pagination";
import { PER_PAGE } from "@/lib/constants";

describe("Pagination", () => {
  it("disables Previous on the first page and Next on the last page", () => {
    const totalCount = PER_PAGE * 2;

    const { rerender } = render(
      <Pagination
        searchParams={{ q: "next.js", page: 1, sort: "best-match" }}
        totalCount={totalCount}
      />,
    );

    expect(screen.getByText("Previous")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("link", { name: "Next" })).toBeInTheDocument();

    rerender(
      <Pagination
        searchParams={{ q: "next.js", page: 2, sort: "best-match" }}
        totalCount={totalCount}
      />,
    );

    expect(screen.getByRole("link", { name: "Previous" })).toBeInTheDocument();
    expect(screen.getByText("Next")).toHaveAttribute("aria-disabled", "true");
  });

  it("shows page numbers with ellipsis and marks the current page", () => {
    render(
      <Pagination
        searchParams={{ q: "next.js", page: 5, sort: "best-match" }}
        totalCount={PER_PAGE * 50}
      />,
    );

    expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "50" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "5" })).not.toBeInTheDocument();
    expect(screen.getByText("5")).toHaveAttribute("aria-current", "page");
    expect(screen.getAllByText("…").length).toBeGreaterThan(0);
  });
});
