import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useNavigation } from "react-router";
import SubmitBtn from "./SubmitBtn";

vi.mock("react-router", () => ({
  useNavigation: vi.fn(() => ({ state: "idle" })),
}));

vi.mock("@radix-ui/react-icons", () => ({
  ReloadIcon: () => <span data-testid="spinner">🌀</span>,
}));

describe("SubmitBtn Component", () => {
  const mockUseNavigation = vi.mocked(useNavigation);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows normal state when not submitting", () => {
    render(<SubmitBtn text="Submit Form" />);

    expect(screen.getByText("Submit Form")).toBeInTheDocument();
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("shows loading state when submitting", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockUseNavigation.mockReturnValueOnce({ state: "submitting" } as any);
    render(<SubmitBtn text="Submit Form" />);

    expect(screen.getByText("Submitting...")).toBeInTheDocument();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<SubmitBtn text="Submit" className="custom-class" />);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });
});
