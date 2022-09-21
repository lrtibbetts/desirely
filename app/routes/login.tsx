import { ActionArgs, ActionFunction, LoaderArgs, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import InputFieldWithError from "~/components/InputFieldWithError";
import { createUserSession, getUserId } from "~/models/session.server";
import { login, LoginResult } from "~/models/user.server";
import { ActionData, badRequest, validateEmail, validatePassword } from "~/utils";

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
    const userId = await getUserId(request);
    if (userId) {
      return redirect("/habits");
    }
    return {};
  }

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

// TOOD: move CSS to stylesheet
export default function LoginPage() {
    const actionData = useActionData<LoginActionData>() as LoginActionData;

    // TODO: toggle for password visibility
    return(
        <div>
            <h1>Log in</h1>
            <Form method="post">
                <div style={{display:"inline-block"}}>
                    <InputFieldWithError<LoginActionData>
                        actionData={actionData}
                        label="Email: "
                        fieldName="email"/>
                    <InputFieldWithError<LoginActionData>
                        actionData={actionData}
                        label="Password: "
                        fieldName="password"
                        isPassword={true}/>
                    <div>
                        {actionData?.error? (
                            <p style={{fontSize: "small"}}>
                                {actionData.error}
                            </p>
                        ) : null}
                        <button type="submit">Log in</button>
                    </div>
                    <div style={{marginTop:"20px", fontSize: "small"}}>
                        <Link to="/join">Sign up instead</Link>
                    </div>
                </div>
            </Form>
        </div>
    );
}