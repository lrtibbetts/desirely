import { ActionArgs, ActionFunction, json, LoaderArgs, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import InputFieldWithError from "~/components/InputFieldWithError";
import { getUserId, createUserSession } from "~/models/session.server";
import { createUser, getUserByEmail } from "~/models/user.server";
import { ActionData, badRequest, emptyInputErrorString, validateEmail, validatePassword } from "~/utils";

export const loader: LoaderFunction = async({ request }: LoaderArgs) => {
    const userId = await getUserId(request);
    if (userId) {
        return redirect("/habits");
      }
    return json({});
}

interface JoinActionData extends ActionData {
    fieldErrors? : {
        email: string | undefined,
        password: string | undefined,
        firstName: string | undefined,
        lastName: string | undefined,
    },
    fields?: {
        email: string | undefined,
        password: string | undefined,
        firstName: string | undefined,
        lastName: string | undefined,
    }
}

function validateName(name: string) {
    if (name.length === 0) {
        return emptyInputErrorString;
    }
}

export const action: ActionFunction = async({ request }: ActionArgs) => {
    const form = await request.formData();

    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;

    const fieldErrors = {
        email: validateEmail(email),
        password: validatePassword(password),
        firstName: validateName(firstName),
        lastName: validateName(lastName),
    }
    const fields = { email, password, firstName, lastName }
    if (Object.values(fieldErrors).some(Boolean)) {
        console.log({fieldErrors, fields})
        return badRequest<ActionData>({ fieldErrors, fields });
    }

    const userAlreadyExists = await getUserByEmail(email);
    if (userAlreadyExists) {
        console.log("User already exists");
        return badRequest<ActionData>({error: "User already exists, please log in instead"});
    }

    const user = await createUser({email, firstName, lastName}, password);

    return createUserSession(user.id, "/");
}


// TODO: password confirmation
export default function SignUpPage() {
    const actionData = useActionData<JoinActionData>() as JoinActionData;
    
    return(
        <div>
            <h1>Sign up</h1>
            <Form method="post">
                <div style={{display:"inline-block"}}>
                    <InputFieldWithError<JoinActionData>
                        actionData={actionData}
                        label="Email: "
                        fieldName="email"/>
                    <InputFieldWithError<JoinActionData>
                        actionData={actionData}
                        label="Password: "
                        fieldName="password"
                        isPassword={true}/>
                    <InputFieldWithError<JoinActionData>
                        actionData={actionData}
                        label="First Name: "
                        fieldName="firstName"/>
                    <InputFieldWithError<JoinActionData>
                        actionData={actionData}
                        label="Last Name: "
                        fieldName="lastName"/>
                    <p>
                        <button type="submit">Sign up</button>
                    </p>
                    <div style={{marginTop:"20px", fontSize: "small"}}>
                        <Link to="/login">Log in instead</Link>
                    </div>
                </div>
            </Form>
        </div>
    );
}