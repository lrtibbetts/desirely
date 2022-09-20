import { ActionFunction } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { createUserSession } from "~/models/session.server";
import { login } from "~/models/user.server";

export const action: ActionFunction = async({ request }) => {
    const form = await request.formData();

    const email = form.get("email") as string;
    const password = form.get("password") as string;

    // TODO: validate input

    const userId = await login(email, password);

    if (!userId) {
        // TODO: bad request handling
        throw new Error("User does not exist");
    }

    return createUserSession(userId, "/habits");
}


// TOOD: move CSS to stylesheet
// TODO: hide password input
// TODO: display requirements for email, password (length to start)
export default function LoginPage() {
    const actionData = useActionData();

    return(
        <div>
            <h1>Login</h1>
            <Form method="post">
                <div style={{display:"inline-block"}}>
                    <p >
                        <label>Email: </label>
                        <input type="text" name="email" style={{width: "200px"}}></input>
                    </p>
                    <p>
                        <label>Password: </label>
                        <input type="text" name="password" style={{width: "200px"}}></input>
                    </p>
                    <p>
                        <button type="submit">Login</button>
                    </p>
                    <div style={{marginTop:"50px", fontSize: "small"}}>
                        <Link to="/join">Sign up instead</Link>
                    </div>
                </div>
            </Form>
        </div>
    );
}