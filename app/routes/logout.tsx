import { ActionArgs, ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { logout } from "~/models/session.server";

export const action: ActionFunction = async ({ request }: ActionArgs) => {
    return logout(request);
}

export const loader: LoaderFunction = async () => {
    return redirect("/");
  };