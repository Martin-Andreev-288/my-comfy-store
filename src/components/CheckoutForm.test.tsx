import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router";
import CheckoutForm, { action } from "./CheckoutForm";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { customFetch } from "@/utils";
import { toast } from "@/components/ui/use-toast";
import cartReducer from "@/features/cart/cartSlice";
import userReducer from "@/features/user/userSlice";

// Mock customFetch similar to apiClient in Login test
vi.mock("@/utils", () => ({
  customFetch: {
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
  formatAsDollars: vi.fn((price) => `$${price / 100}`),
}));

// Mock toast implementation
vi.mock("@/components/ui/use-toast", () => ({
  toast: vi.fn(),
}));

// Mock FormInput with testable implementation
vi.mock("./FormInput", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ label, name }: any) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} data-testid={name} />
    </div>
  ),
}));

const mockStore = (initialState = {}) =>
  configureStore({
    reducer: {
      cartState: cartReducer,
      userState: userReducer,
    },
    preloadedState: {
      userState: {
        user: { username: "test", jwt: "test-token" },
      },
      cartState: {
        cartItems: [
          {
            cartID: "1",
            productID: 1,
            image: "test.jpg",
            title: "Test Product",
            price: "1000",
            amount: 1,
            productColor: "red",
            company: "Test Co",
          },
        ],
        numItemsInCart: 1,
        cartTotal: 1000,
        shipping: 500,
        tax: 100,
        orderTotal: 1600,
      },
      ...initialState,
    },
  });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setupRouter = (store: any) =>
  createMemoryRouter(
    [
      {
        path: "/checkout",
        element: <CheckoutForm />,
        action: action(store),
      },
      {
        path: "/login",
        element: <div>Login</div>,
      },
      {
        path: "/orders",
        element: <div>Orders</div>,
      },
    ],
    { initialEntries: ["/checkout"] }
  );

describe("CheckoutForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Update the successful order test
  it("shows validation errors for empty fields", async () => {
    const store = mockStore();
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <RouterProvider router={setupRouter(store)} />
      </Provider>
    );

    await user.click(screen.getByRole("button", { name: /place your order/i }));

    await waitFor(
      () => {
        expect(toast).toHaveBeenCalledWith({
          description: "please fill out all fields",
        });
      },
      { timeout: 2000 }
    );
  });

  // Update the authentication check test
  it("redirects to login if user not authenticated", async () => {
    const store = mockStore({
      userState: { user: null },
      cartState: {
        cartItems: [],
        numItemsInCart: 0,
        cartTotal: 0,
        shipping: 0,
        tax: 0,
        orderTotal: 0,
      },
    });

    const user = userEvent.setup();
    const router = setupRouter(store);

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    await user.type(screen.getByLabelText(/first name/i), "Test User");
    await user.type(screen.getByLabelText(/address/i), "123 Street");
    await user.click(screen.getByRole("button", { name: /place your order/i }));

    await waitFor(
      () => {
        expect(toast).toHaveBeenCalledWith({
          description: "please login to place an order",
        });
        expect(router.state.location.pathname).toBe("/login");
      },
      { timeout: 2000 }
    );
  });

  it("handles successful order submission", async () => {
    const store = mockStore();
    const user = userEvent.setup();
    const router = setupRouter(store);

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    await user.type(screen.getByLabelText(/first name/i), "Test User");
    await user.type(screen.getByLabelText(/address/i), "123 Street");
    await user.click(screen.getByRole("button", { name: /place your order/i }));

    await waitFor(
      () => {
        expect(customFetch.post).toHaveBeenCalledWith(
          "/orders",
          {
            data: expect.objectContaining({
              name: "Test User",
              address: "123 Street",
              chargeTotal: 1600,
              numItemsInCart: 1,
              orderTotal: "$16",
              cartItems: expect.arrayContaining([
                expect.objectContaining({
                  cartID: "1",
                  productID: 1,
                  price: "1000",
                  amount: 1,
                }),
              ]),
            }),
          },
          {
            headers: {
              Authorization: "Bearer test-token",
            },
          }
        );

        // Other assertions remain the same
        expect(store.getState().cartState.cartItems).toHaveLength(0);
        expect(toast).toHaveBeenCalledWith({ description: "order placed" });
        expect(router.state.location.pathname).toBe("/orders");
      },
      { timeout: 3000 }
    );
  });

  test("handles order submission failure", async () => {
    const store = mockStore();
    const user = userEvent.setup();
    (customFetch.post as Mock).mockRejectedValue(new Error("API Error"));
    const router = setupRouter(store);

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    await user.type(screen.getByLabelText(/first name/i), "Test User");
    await user.type(screen.getByLabelText(/address/i), "123 Street");
    await user.click(screen.getByRole("button", { name: /place your order/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({ description: "order failed" });
      expect(router.state.location.pathname).not.toBe("/orders");
    });
  });
});
