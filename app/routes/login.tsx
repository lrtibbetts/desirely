import { ActionFunction, json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { createUserSession } from "~/models/session.server";
import { login, LoginResult } from "~/models/user.server";
import { badRequest, validateEmail, validatePassword } from "~/utils";

type ActionData = {
    error?: string,
    fieldErrors?: {
        email: string | undefined,
        password: string | undefined,
    },
    fields?: {
        email: string | undefined,
        password: string | undefined,
    }
}

export const action: ActionFunction = async({ request }) => {
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
    const actionData = useActionData<ActionData>();

    // TODO: toggle for password visibility
    return(
        <div>
            <h1>Log in</h1>
            <Form method="post">
                <div style={{display:"inline-block"}}>
                    <p>
                        <label>Email:
                            <input 
                                type="text" name="email" style={{width: "200px"}}
                                aria-invalid={actionData?.fieldErrors?.email ? true : undefined}
                                aria-errormessage={
                                    actionData?.fieldErrors?.email ? "email-error" : undefined
                                }/>
                        </label>
                        {actionData?.fieldErrors?.email ? (
                            <p style={{fontSize: "small"}} role="alert" id="email-error">
                                {actionData.fieldErrors.email}
                            </p>) : null}
                    </p>
                    <p>
                        <label>Password:
                        <input 
                            type="password" name="password" style={{width: "200px"}}
                            aria-invalid={actionData?.fieldErrors?.password ? true : undefined}
                            aria-errormessage={
                                actionData?.fieldErrors?.email ? "password-error" : undefined
                            }/>
                         </label>
                         {actionData?.fieldErrors?.password ? (
                            <p style={{fontSize: "small"}} role="alert" id="password-error">
                                {actionData.fieldErrors.password}
                            </p>) : null}
                    </p>
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