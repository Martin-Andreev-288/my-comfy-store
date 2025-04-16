import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import NavLinks from "./NavLinks";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer, { User, UserState } from "@/features/user/userSlice";
import { links } from "@/utils/links";

// Mock store setup
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

describe("NavLinks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders public navigation links", () => {
    const store = mockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NavLinks />
        </MemoryRouter>
      </Provider>
    );

    // Test public links that should always be visible
    const publicLinks = links.filter(
      (link) => !["checkout", "orders"].includes(link.href)
    );

    publicLinks.forEach((link) => {
      expect(
        screen.getByRole("link", { name: link.label })
      ).toBeInTheDocument();
    });
  });

  it("hides restricted links when user is not logged in", () => {
    const store = mockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NavLinks />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByRole("link", { name: "checkout" })).toBeNull();
    expect(screen.queryByRole("link", { name: "orders" })).toBeNull();
  });

  it("shows restricted links when user is logged in", () => {
    const testUser: User = {
      username: "testuser",
      jwt: "test-token",
    };

    render(
      <Provider store={mockStore(testUser)}>
        <MemoryRouter>
          <NavLinks />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("link", { name: "checkout" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "orders" })).toBeInTheDocument();
  });

  describe("Active state styling", () => {
    const testCases = [
      { path: "/", label: "home" },
      { path: "/products", label: "products" },
      { path: "/cart", label: "cart" },
      { path: "/about", label: "about" },
    ];

    testCases.forEach(({ path, label }) => {
      it(`applies active style for ${label} link at ${path}`, () => {
        const store = mockStore();
        render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[path]}>
              <NavLinks />
            </MemoryRouter>
          </Provider>
        );

        const link = screen.getByRole("link", { name: label });
        expect(link).toHaveClass("text-primary");
      });
    });
  });
});
