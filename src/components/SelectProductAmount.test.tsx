import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SelectProductAmount, { Mode } from "./SelectProductAmount";

// Minimal mocks for shadcn components
vi.mock("@/components/ui/select", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Select: ({ children }: { children: any }) => children,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SelectContent: ({ children }: { children: any }) => <div>{children}</div>,
  SelectItem: ({ value }: { value: string }) => <div>{value}</div>,
  SelectTrigger: () => <div />,
  SelectValue: () => <div />,
}));

describe("SelectProductAmount Component", () => {
  it("generates correct options for SingleProduct mode", () => {
    render(
      <SelectProductAmount
        mode={Mode.SingleProduct}
        amount={1}
        setAmount={() => {}}
      />
    );

    const options = screen.getAllByText(/^\d+$/);
    expect(options).toHaveLength(10);
    expect(options[0]).toHaveTextContent("1");
    expect(options[9]).toHaveTextContent("10");
  });

  it("generates correct options for CartItem mode", () => {
    const currentAmount = 3;
    render(
      <SelectProductAmount
        mode={Mode.CartItem}
        amount={currentAmount}
        setAmount={() => {}}
      />
    );

    const options = screen.getAllByText(/^\d+$/);
    expect(options).toHaveLength(currentAmount + 10);
    expect(options[currentAmount + 9]).toHaveTextContent(
      String(currentAmount + 10)
    );
  });
});
