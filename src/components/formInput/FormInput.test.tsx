import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormInput from "./FormInput";

describe("FormInput Component", () => {
  it("renders input with correct name and id", () => {
    const name = "username";
    render(<FormInput name={name} type="text" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("name", name);
    expect(input).toHaveAttribute("id", name);
  });

  it("associates label with input correctly", () => {
    const name = "email";
    render(<FormInput name={name} type="email" />);

    const input = screen.getByLabelText(name);
    expect(input).toBeInTheDocument();
  });

  it("displays custom label when provided", () => {
    const label = "Password";
    render(<FormInput name="password" type="password" label={label} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("uses name as label when no label prop provided", () => {
    const name = "username";
    render(<FormInput name={name} type="text" />);

    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it("sets correct input type", () => {
    const type = "email";
    render(<FormInput name="email" type={type} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", type);
  });

  it("shows default value when provided", () => {
    const defaultValue = "test@example.com";
    render(<FormInput name="email" type="email" defaultValue={defaultValue} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue(defaultValue);
  });

  it("renders empty input when no defaultValue", () => {
    render(<FormInput name="message" type="text" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });
});
