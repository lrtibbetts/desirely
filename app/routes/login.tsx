import { ActionArgs, ActionFunction, LoaderArgs, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { createUserSession, getUserId } from "~/models/session.server";
import { login, LoginResult } from "~/models/user.server";
import InputFieldWithError from "~/components/InputFieldWithError";
import { ActionData, badRequest, validateEmail, validatePassword } from "~/utils";

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
    const userId = await getUserId(request);
    if (userId) {
      return redirect("/habits");
    }
    return {};
  }

// TODO: fields really needed here? or just errors
interface LoginActionData extends ActionData {
    fieldErrors?: {
        email: string | undefined,
        password: string | undefined,
    },
    fields?: {
        email: string | undefined,
        password: string | undefined,
    }
}

export const action: ActionFunction = async({ request }: ActionArgs) => {
    const form = await request.formData();

    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const fieldErrors = {
        email: validateEmail(email),
        password: validatePassword(password),
    }
    const fields = { email, password }
    if (Object.values(fieldErrors).some(Boolean)) {
        console.log({fieldErrors, fields})
        return badRequest<ActionData>({ fieldErrors, fields });
    }

    const result : LoginResult = await login(email, password);

    if (result.error) {
        console.log(result.error);
        return badRequest<ActionData>({error: result.error});
    }

    const id = result.userId as string;
    return createUserSession(id, "/habits");
}

export default function LoginPage() {
    const actionData = useActionData<LoginActionData>() as LoginActionData;

    // TODO: toggle for password visibility
    return(
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-lg mt-6 text-cyan-800">log in</h1>
            <Form method="post" className="flex flex-col border-2 rounded-md border-cyan-700 pb-3 px-3 mt-6">
                <InputFieldWithError<LoginActionData>
                    actionData={actionData}
                    label="email: "
                    fieldName="email"/>
                <InputFieldWithError<LoginActionData>
                    actionData={actionData}
                    label="password: "
                    fieldName="password"
                    isPassword={true}/>
                {actionData?.error ? <p>{actionData.error}</p> : null}
                <button type="submit" className="rounded-md mt-6 bg-cyan-700 hover:bg-cyan-800 text-cyan-50 px-2 py-1 w-fit self-center">log in</button>
            </Form>
            <Link to="/join" className="text-sm mt-4 hover:underline text-cyan-800">sign up instead</Link>
        </div>
    );
}