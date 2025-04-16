import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FormRange from "./FormRange";
import { formatAsDollars } from "@/utils";

// Mock the formatAsDollars utility
vi.mock("@/utils", () => ({
  formatAsDollars: vi.fn((price) => `$${Number(price) / 100}`),
}));

// Mock the Slider component to use native input
vi.mock("@/components/ui/slider", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Slider: ({ value, max, step, onValueChange, ...props }: any) => (
    <input
      {...props}
      type="range"
      value={value?.[0] || 0}
      max={max}
      step={step}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      data-testid="slider-input"
    />
  ),
}));

describe("FormRange Component", () => {
  const mockProps = {
    name: "price",
    label: "Price Range",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default value when no defaultValue provided", () => {
    render(<FormRange {...mockProps} />);

    const slider = screen.getByTestId("slider-input");
    expect(slider).toHaveValue("100000"); // default maxPrice
    expect(formatAsDollars).toHaveBeenCalledWith(100000);
  });

  it("renders with provided defaultValue", () => {
    render(<FormRange {...mockProps} defaultValue="50000" />);

    const slider = screen.getByTestId("slider-input");
    expect(slider).toHaveValue("50000");
    expect(formatAsDollars).toHaveBeenCalledWith(50000);
  });

  it("updates displayed value when slider changes", () => {
    render(<FormRange {...mockProps} />);
    const slider = screen.getByTestId("slider-input");

    fireEvent.change(slider, { target: { value: "75000" } });

    expect(slider).toHaveValue("75000");
    expect(formatAsDollars).toHaveBeenCalledWith(75000);
    expect(screen.getByText("$750")).toBeInTheDocument();
  });

  it("formats price correctly", () => {
    render(<FormRange {...mockProps} defaultValue="42000" />);
    expect(formatAsDollars).toHaveBeenCalledWith(42000);
    expect(screen.getByText("$420")).toBeInTheDocument();
  });
});
