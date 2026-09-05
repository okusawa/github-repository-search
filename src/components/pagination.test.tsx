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
});
