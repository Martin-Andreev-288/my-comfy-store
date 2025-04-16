import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import LinksDropdown from "./LinksDropdown";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer, { User } from "@/features/user/userSlice";

type UserState = {
  user: User | null;
};

// Mock dropdown components
vi.mock("@/components/ui/dropdown-menu", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DropdownMenu: ({ children }: { children: any }) => children,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DropdownMenuTrigger: ({ children }: { children: any }) => (
    <div data-testid="trigger">{children}</div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DropdownMenuContent: ({ children }: { children: any }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DropdownMenuItem: ({ children }: { children: any }) => <div>{children}</div>,
}));

// Mock icons
vi.mock("lucide-react", () => ({
  AlignLeft: () => <span>Menu Icon</span>,
}));

const mockStore = (user: User | null = null) =>
  configureStore({
    reducer: { userState: userReducer },
    preloadedState: {
      userState: {
        user,
        status: "idle",
        error: null,
      } as UserState,
    },
  });

describe("LinksDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dropdown trigger button", () => {
    const store = mockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LinksDropdown />
        </MemoryRouter>
      </Provider>
    );

    // Use more specific selector
    const triggerButton = screen.getByRole("button", {
      name: /toggle links/i,
    });

    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton).toContainElement(screen.getByText("Menu Icon"));
  });

  it("hides restricted links when unauthenticated", () => {
    const store = mockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LinksDropdown />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText("checkout")).toBeNull();
    expect(screen.queryByText("orders")).toBeNull();
  });

  it("shows restricted links when authenticated", () => {
    const testUser: User = {
      username: "testuser",
      jwt: "test-token",
    };

    render(
      <Provider store={mockStore(testUser)}>
        <MemoryRouter>
          <LinksDropdown />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("link", { name: "checkout" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "orders" })).toBeInTheDocument();
  });

  it("applies active style to current route", () => {
    const store = mockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/products"]}>
          <LinksDropdown />
        </MemoryRouter>
      </Provider>
    );

    const productsLink = screen.getByText("products");
    expect(productsLink).toHaveClass("text-primary");
  });
});
