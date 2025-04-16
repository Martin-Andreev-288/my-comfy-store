import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, useNavigate } from "react-router";
import Header from "./Header";
import userReducer, { logoutUser } from "@/features/user/userSlice";
import { clearCart } from "@/features/cart/cartSlice";
import cartReducer from "@/features/cart/cartSlice";
import { useToast } from "@/components/ui/use-toast";
import type { User } from "@/features/user/userSlice";

// Mock dependencies
vi.mock("./ui/use-toast", () => ({
  useToast: vi.fn(() => ({ toast: vi.fn() })),
}));

vi.mock("react-router", async () => ({
  ...(await vi.importActual<typeof import("react-router")>("react-router")),
  redirect: (path: string) => ({
    status: 302,
    location: path,
    headers: {
      set: vi.fn(),
    },
  }),
  useNavigate: vi.fn(),
}));

type UserState = {
  user: User | null;
};

const mockStore = (user: User | null = null) =>
  configureStore({
    reducer: {
      userState: userReducer,
      cartState: cartReducer,
    },
    preloadedState: {
      userState: {
        user,
      } as UserState,
    },
  });

describe("Header Component", () => {
  const mockNavigate = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    (useToast as Mock).mockReturnValue({ toast: mockToast });
  });

  describe("Unauthenticated State", () => {
    it("renders sign in and register links", () => {
      render(
        <Provider store={mockStore()}>
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText(/sign in \/ guest/i)).toBeInTheDocument();
      expect(screen.getByText(/register/i)).toBeInTheDocument();
    });
  });

  describe("Authenticated State", () => {
    const testUser: User = {
      username: "testuser",
      jwt: "test-token",
    };

    it("displays welcome message and logout button", () => {
      render(
        <Provider store={mockStore(testUser)}>
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText(/hello, testuser/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /logout/i })
      ).toBeInTheDocument();
    });

    it("handles logout correctly", async () => {
      const user = userEvent.setup();
      const store = mockStore(testUser);
      const mockDispatch = vi.spyOn(store, "dispatch");

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        </Provider>
      );

      await user.click(screen.getByRole("button", { name: /logout/i }));

      // Verify Redux actions
      expect(mockDispatch).toHaveBeenCalledWith(clearCart());
      expect(mockDispatch).toHaveBeenCalledWith(logoutUser());

      // Verify toast and navigation
      expect(mockToast).toHaveBeenCalledWith({ description: "Logged out" });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
