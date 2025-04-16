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

  it("uses the defaultValue if provided", () => {
    render(<FormSelect {...defaultProps} defaultValue="cherry" />);
    expect(screen.getByText("cherry")).toBeInTheDocument();
  });
});
