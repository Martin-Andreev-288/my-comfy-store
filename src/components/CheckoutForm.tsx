import { ActionFunction, Form, redirect } from "react-router-dom";
import FormInput from "./FormInput";
import SubmitBtn from "./SubmitBtn";
import { customFetch, formatAsDollars, type Checkout } from "@/utils";
import { toast } from "@/components/ui/use-toast";
import { clearCart } from "../features/cart/cartSlice";
import { ReduxStore } from "@/store";

export const action =
  (store: ReduxStore): ActionFunction =>
  async ({ request }): Promise<null> => {
    return null;
  };

function CheckoutForm() {
  return (
    <Form method="post" className="flex flex-col gap-y-4">
      <h4 className="font-medium text-xl mb-4">Shipping Information</h4>
      <FormInput label="first name" name="name" type="text" />
      <FormInput label="address" name="address" type="text" />
      <SubmitBtn text="Place Your Order" className="mt-4" />
    </Form>
  );
}
export default CheckoutForm;
