import { describe, test, vi, beforeEach, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import Login, { action } from "./Login";
import { customFetch } from "@/utils";
import { toast } from "@/components/ui/use-toast";
import userReducer, { type User } from "@/features/user/userSlice";

type UserState = {
  user: User | null;
};

// Mock dependencies
vi.mock("@/utils", () => ({
  applyTheme: vi.fn(),
  customFetch: {
    post: vi.fn(),
  },
}));

vi.mock("@/components/ui/use-toast", () => ({
  toast: vi.fn(),
}));

vi.mock("@/components/formInput/FormInput", () => ({
  default: ({ name, type }: { name: string; type: string }) => (
    <input name={name} type={type} data-testid={name} />
  ),
}));

const mockStore = (initialState?: Partial<UserState>) =>
  configureStore({
    reducer: { userState: userReducer },
    preloadedState: { userState: { ...initialState } as UserState },
  });

const renderLogin = (store = mockStore()) => {
  const router = createMemoryRouter(
    [
      {
        path: "/login",
        element: <Login />,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        action: action(store as any),
      },
      {
        path: "/",
        element: <div>Home</div>,
      },
      {
        path: "/register",
        element: <div>Register</div>,
      },
    ],
    { initialEntries: ["/login"] }
  );

  return {
    user: userEvent.setup(),
    ...render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    ),
    router,
    store,
  };
};

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("renders login form with all elements", () => {
    renderLogin();

    expect(screen.getByTestId("identifier")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register/i })).toHaveAttribute(
      "href",
      "/register"
    );
  });

  test("handles successful user login", async () => {
    const { user, store } = renderLogin();
    const mockUser = { username: "testuser", jwt: "test-jwt" };

    (customFetch.post as Mock).mockResolvedValueOnce({
      data: { user: { username: "testuser" }, jwt: "test-jwt" },
    });

    await user.type(screen.getByTestId("identifier"), "test@test.com");
    await user.type(screen.getByTestId("password"), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(customFetch.post).toHaveBeenCalledWith("/auth/local", {
        identifier: "test@test.com",
        password: "password123",
      });
    });

    expect(store.getState().userState.user).toEqual(mockUser);
    expect(toast).toHaveBeenCalledWith({ description: "Login successful" });
  });

  test("handles login error", async () => {
    const { user } = renderLogin();
    (customFetch.post as Mock).mockRejectedValueOnce(new Error("API Error"));

    await user.type(screen.getByTestId("identifier"), "test@test.com");
    await user.type(screen.getByTestId("password"), "wrongpass");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({ description: "Login Failed" });
    });
  });

  test("handles guest login", async () => {
    const { user, store } = renderLogin();
    const mockGuest = { username: "demo user", jwt: "guest-jwt" };

    (customFetch.post as Mock).mockResolvedValueOnce({
      data: { user: { username: "demo user" }, jwt: "guest-jwt" },
    });

    await user.click(screen.getByRole("button", { name: /guest user/i }));

    await waitFor(() => {
      expect(customFetch.post).toHaveBeenCalledWith("/auth/local", {
        identifier: "test@test.com",
        password: "secret",
      });
    });

    expect(store.getState().userState.user).toEqual(mockGuest);
    expect(toast).toHaveBeenCalledWith({ description: "Welcome Guest User" });
  });
});
