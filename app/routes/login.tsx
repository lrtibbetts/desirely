import { ActionFunction, json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { createUserSession } from "~/models/session.server";
import { login } from "~/models/user.server";

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

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// TODO: other fields?
function badRequest(data: ActionData) {
    return json(data, {status: 400});
}

function validateEmail(email: string): string | undefined {
    if (email.toLowerCase().match(emailRegex) === null) {
        return "Email is not valid";
    }
}

function validatePassword(password: string): string | undefined {
    if (password.length <= 6) {
        return "Password is too short";
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
        return badRequest({ fieldErrors, fields });
    }

    // TODO: distinguish between a) user doesn't exist, b) wrong pwd
    const userId = await login(email, password);

    if (!userId) {
        console.log("User does not exist");
        return badRequest({error: "User does not exist"});
    }

    return createUserSession(userId, "/habits");
}


// TOOD: move CSS to stylesheet
// TODO: hide password input
// TODO: display requirements for email, password (length to start)
export default function LoginPage() {
    const actionData = useActionData<ActionData>();

    return(
        <div>
            <h1>Log in</h1>
            <Form method="post">
                <div style={{display:"inline-block"}}>
                    <p>
                        <label>Email:
                            <input 
                                type="text" name="email" style={{width: "200px"}}
                                aria-invalid={
                                    Boolean(actionData?.fieldErrors?.email) || undefined
                                }
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
                            type="text" name="password" style={{width: "200px"}}
                            aria-invalid={
                                Boolean(actionData?.fieldErrors?.password) || undefined
                            }
                            aria-errormessage={
                                actionData?.fieldErrors?.email ? "password-error" : undefined
                            }/>
                         </label>
                         {actionData?.fieldErrors?.password ? (
                            <p style={{fontSize: "small"}} role="alert" id="password-error">
                                {actionData.fieldErrors.password}
                            </p>) : null}
                    </p>
                    <p>
                        <button type="submit">Log in</button>
                    </p>
                    <div style={{marginTop:"50px", fontSize: "small"}}>
                        <Link to="/join">Sign up instead</Link>
                    </div>
                </div>
            </Form>
        </div>
    );
}