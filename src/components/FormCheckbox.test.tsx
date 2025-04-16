import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormCheckbox from "./FormCheckbox";

describe("FormCheckbox", () => {
  it("renders with default label from name", () => {
    render(<FormCheckbox name="terms" />);
    expect(screen.getByLabelText(/terms/i)).toBeInTheDocument();
  });

  it("renders with a custom label", () => {
    render(<FormCheckbox name="subscribe" label="Subscribe to newsletter" />);
    expect(
      screen.getByLabelText(/subscribe to newsletter/i)
    ).toBeInTheDocument();
  });

  it("is unchecked by default when defaultValue is not 'on'", () => {
    render(<FormCheckbox name="accept" defaultValue="off" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("is checked when defaultValue is 'on'", () => {
    render(<FormCheckbox name="accept" defaultValue="on" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("can be toggled by the user", async () => {
    const user = userEvent.setup();
    render(<FormCheckbox name="notifications" />);
    const checkbox = screen.getByRole("checkbox");

    // Toggle on
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    // Toggle off
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
