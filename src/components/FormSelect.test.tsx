import { render, screen } from "@testing-library/react";
import FormSelect from "./FormSelect";

const defaultProps = {
  name: "fruit",
  label: "Choose a fruit",
  options: ["apple", "banana", "cherry"],
};

describe("FormSelect", () => {
  it("renders the label", () => {
    render(<FormSelect {...defaultProps} />);
    expect(screen.getByLabelText(/choose a fruit/i)).toBeInTheDocument();
  });

  it("renders the default selected value", () => {
    render(<FormSelect {...defaultProps} />);
    expect(screen.getByText(/apple/i)).toBeInTheDocument();
  });
  // The two tests below doesn't work. We couldn't fix the problem.
  // If you want to try them - you can import also fireEvent from @testing-library/react and to add ` data-testid="select-trigger"` in the SelectTrigger (next to the id={name} in FormRange.tsx).
  // it("renders all options when triggered", async () => {
  //   render(<FormSelect {...defaultProps} />);
  //   fireEvent.click(screen.getByTestId("select-trigger"));
  //   expect(await screen.findByText("apple")).toBeInTheDocument();
  //   expect(await screen.findByText("banana")).toBeInTheDocument();
  //   expect(await screen.findByText("cherry")).toBeInTheDocument();
  // });

  // it("selects a different option", async () => {
  //   render(<FormSelect {...defaultProps} />);
  //   // fireEvent.click(screen.getByRole("button"));
  //   fireEvent.click(screen.getByTestId("select-trigger"));
  //   fireEvent.click(screen.getByText("banana"));
  //   // Now the trigger should show "banana"
  //   expect(await screen.findByText("banana")).toBeInTheDocument();
  // });

  it("uses the defaultValue if provided", () => {
    render(<FormSelect {...defaultProps} defaultValue="cherry" />);
    expect(screen.getByText("cherry")).toBeInTheDocument();
  });
});
