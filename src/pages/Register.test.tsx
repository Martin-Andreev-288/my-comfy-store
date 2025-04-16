import { describe, test, vi, beforeEach, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router";
import Register, { action } from "./Register";
import { customFetch } from "@/utils";
import { toast } from "@/components/ui/use-toast";

vi.mock("@/utils", () => ({
  applyTheme: vi.fn(),
  customFetch: {
    post: vi.fn(),
  },
}));

vi.mock("@/components/ui/use-toast", () => ({
  toast: vi.fn(),
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
}));

const renderRegister = (initialEntries = ["/register"]) => {
  const router = createMemoryRouter(
    [
      {
        path: "/register",
        element: <Register />,
        action,
      },
      {
        path: "/login",
        element: <div>Login page</div>,
      },
    ],
    { initialEntries }
  );
  return {
    user: userEvent.setup(),
    ...render(<RouterProvider router={router} />),
    router,
  };
};

describe("Register Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders registration form with inputs and login link", () => {
    renderRegister();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  test("handles successful registration", async () => {
    const { user } = renderRegister();
    (customFetch.post as Mock).mockResolvedValueOnce({});

    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(screen.getByLabelText(/email/i), "test@test.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({ description: "Registered" });
      expect(customFetch.post).toHaveBeenCalledWith("/auth/local/register", {
        username: "testuser",
        email: "test@test.com",
        password: "password123",
      });
    });
  });

  test("handles registration error", async () => {
    const user = userEvent.setup();
    const errorMessage = "Registration Failed";
    (customFetch.post as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { error: { message: errorMessage } } },
    });

    renderRegister();

    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(screen.getByLabelText(/email/i), "test@test.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({ description: errorMessage });
    });
  });
});
