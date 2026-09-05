import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SearchForm } from "@/components/search-form";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("SearchForm", () => {
  it("navigates to the search URL on submit", async () => {
    const user = userEvent.setup();
    push.mockClear();

    render(<SearchForm defaultQuery="" defaultSort="best-match" />);

    await user.type(screen.getByLabelText("Search query"), "next.js");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(push).toHaveBeenCalledWith("/?q=next.js");
  });

  it("does not navigate when query is empty or whitespace only", async () => {
    const user = userEvent.setup();
    push.mockClear();

    render(<SearchForm defaultQuery="" defaultSort="best-match" />);

    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(push).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText("Search query"), "   ");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(push).not.toHaveBeenCalled();
  });
});
