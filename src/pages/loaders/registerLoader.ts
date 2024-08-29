import { ActionFunction, redirect } from "react-router-dom";
import { customFetch } from "@/utils";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";

export const action: ActionFunction = async ({
    request,
}): Promise<Response | null> => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
        await customFetch.post("/auth/local/register", data);

        toast({ description: "Registered" });
        return redirect("/login");
    } catch (error) {
        const errorMsg =
            error instanceof AxiosError
                ? error.response?.data.error.message
                : "Registration Failed";
        toast({ description: errorMsg });
        return null;
    }
};
