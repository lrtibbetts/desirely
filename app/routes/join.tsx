import { ActionArgs, ActionFunction, json, LoaderArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { createUser, createUserSession, getUserByEmail, getUserId } from "~/models/user.server";

export async function loader({ request }: LoaderArgs) {
    const userId = await getUserId(request);
    return json({});
}

export const action: ActionFunction = async({ request }: ActionArgs) => {
    const form = await request.formData();

    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;

    // TODO: validate email, password

    const userAlreadyExists = await getUserByEmail(email);
    if (userAlreadyExists) {
        // Handle
        console.log("User already exists, please log in!");
    }

    const user = await createUser({email, firstName, lastName}, password);

    return createUserSession(user.id, "/");
}


// TODO: password confirmation
export default function SignUpPage() {
    const actionData = useActionData();
    
    return(
        <div>
            <h1>Sign up</h1>
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
                        <label>First Name: </label>
                        <input type="text" name="firstName" style={{width: "200px"}}></input>
                    </p>
                    <p>
                        <label>Last Name: </label>
                        <input type="text" name="lastName" style={{width: "200px"}}></input>
                    </p>
                    <p>
                        <button type="submit" style={{fontFamily: "Courier New, monospace"}}>Sign up</button>
                    </p>
                </div>
            </Form>
        </div>
    );
}