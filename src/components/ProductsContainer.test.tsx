import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductsContainer from "./ProductsContainer";
import { useLoaderData } from "react-router";

// Mock child components and dependencies
vi.mock("./ProductsGrid", () => ({ default: () => <div>Products Grid</div> }));
vi.mock("./ProductsList", () => ({ default: () => <div>Products List</div> }));
vi.mock("react-router", () => ({ useLoaderData: vi.fn() }));
vi.mock("lucide-react", () => ({
  LayoutGrid: () => <span>Grid Icon</span>,
  List: () => <span>List Icon</span>,
}));

describe("ProductsContainer Layout Switching", () => {
  const mockUseLoaderData = vi.mocked(useLoaderData);

  beforeEach(() => {
    mockUseLoaderData.mockReturnValue({
      meta: { pagination: { total: 5 } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it("shows grid layout by default", () => {
    render(<ProductsContainer />);
    expect(screen.getByText("Products Grid")).toBeInTheDocument();
    expect(screen.queryByText("Products List")).not.toBeInTheDocument();
  });

  it("switches to list layout when button clicked", async () => {
    const user = userEvent.setup();
    render(<ProductsContainer />);

    await user.click(screen.getByRole("button", { name: /list icon/i }));

    expect(screen.getByText("Products List")).toBeInTheDocument();
    expect(screen.queryByText("Products Grid")).not.toBeInTheDocument();
  });

  it("default grid button should be active", async () => {
    render(<ProductsContainer />);

    const gridButton = screen.getByRole("button", { name: /grid icon/i });
    expect(gridButton).toHaveClass("bg-primary");
    expect(gridButton).not.toHaveClass("bg-transparent");
  });

  it("switch to list layout", async () => {
    render(<ProductsContainer />);

    const user = userEvent.setup();
    const listButton = screen.getByRole("button", { name: /list icon/i });
    await user.click(listButton);

    expect(listButton).toHaveClass("bg-primary");
    expect(listButton).not.toHaveClass("bg-transparent");
  });
});
