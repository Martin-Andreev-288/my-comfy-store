import {
    redirect,
    type ActionFunction,
} from "react-router-dom";
import { customFetch } from "@/utils";
import { toast } from "@/components/ui/use-toast";
import { type ReduxStore } from "@/store";
import { loginUser } from "@/features/user/userSlice";
import { AxiosResponse } from "axios";

export const action =
    (store: ReduxStore): ActionFunction =>
        async ({ request }): Promise<Response | null> => {
            const formData = await request.formData();
            const data = Object.fromEntries(formData);
            try {
                const response: AxiosResponse = await customFetch.post(
                    "/auth/local",
                    data
                );
                const username = response.data.user.username;
                const jwt = response.data.jwt;
                store.dispatch(loginUser({ username, jwt }));
                return redirect("/");
            } catch (error) {
                console.log(error);
                toast({ description: "Login Failed" });
                return null;
            }
        };
