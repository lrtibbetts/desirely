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

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
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
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-lg mt-6">sign up</h1>
            <Form method="post" className="flex flex-col border-2 rounded-md border-blue-300 pb-3 px-3 mt-6">
                <InputFieldWithError<JoinActionData>
                    actionData={actionData}
                    label="email: "
                    fieldName="email"/>
                <InputFieldWithError<JoinActionData>
                    actionData={actionData}
                    label="password: "
                    fieldName="password"
                    isPassword={true}/>
                <InputFieldWithError<JoinActionData>
                    actionData={actionData}
                    label="first name: "
                    fieldName="firstName"/>
                <InputFieldWithError<JoinActionData>
                    actionData={actionData}
                    label="last name: "
                    fieldName="lastName"/>
                <button type="submit" className="rounded-md mt-6 bg-blue-200 hover:bg-blue-300 px-2 py-1 w-fit self-center">sign up</button>
            </Form>
            <Link to="/login" className="text-sm mt-4 hover:underline">log in instead</Link>
        </div>
    );
}