import { ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export const action: ActionFunction = async({ request }) => {
    const form = await request.formData();

    const email = form.get("email");
    const password = form.get("password");
}


// TOOD: move CSS to stylesheet
export default function LoginPage() {
    const actionData = useActionData();

    return(
        <div>
            <h1>Login</h1>
            <Form method="post">
                <div style={{display:"inline-block"}}>
                    <p>
                        <label>Email: </label>
                        <input type="text" name="email"></input>
                    </p>
                    <p>
                        <label>Password: </label>
                        <input type="text" name="password"></input>
                    </p>
                    <p>
                        <button type="submit" style={{fontFamily: "Courier New, monospace"}}>Login</button>
                    </p>
                </div>
            </Form>
        </div>
    );
}