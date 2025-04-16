import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SelectProductColor from "./SelectProductColor";

describe("SelectProductColor Component", () => {
  const mockColors = ["#FF5733", "#33FF57", "#3366FF"];
  const mockSetProductColor = vi.fn();

  it("renders all color buttons", () => {
    render(
      <SelectProductColor
        colors={mockColors}
        productColor=""
        setProductColor={mockSetProductColor}
      />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(mockColors.length);

    mockColors.forEach((color, index) => {
      expect(buttons[index]).toHaveStyle({ backgroundColor: color });
    });
  });

  it("calls setProductColor with selected color on click", async () => {
    const user = userEvent.setup();
    render(
      <SelectProductColor
        colors={mockColors}
        productColor=""
        setProductColor={mockSetProductColor}
      />
    );

    const firstColorButton = screen.getAllByRole("button")[0];
    await user.click(firstColorButton);

    expect(mockSetProductColor).toHaveBeenCalledWith(mockColors[0]);
  });

  it("shows primary border for selected color", () => {
    const selectedColor = mockColors[1];
    render(
      <SelectProductColor
        colors={mockColors}
        productColor={selectedColor}
        setProductColor={mockSetProductColor}
      />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[1]).toHaveClass("border-primary");

    // Verify other buttons don't have the primary border
    buttons.forEach((button, index) => {
      if (index !== 1) {
        expect(button).not.toHaveClass("border-primary");
      }
    });
  });
});
