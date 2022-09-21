import { ActionFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { createHabit } from "~/models/habit.server";
import { getUserId } from "~/models/session.server";

export const action: ActionFunction = async ({ request }) => {
    const userId = await getUserId(request);

    const formData = await request.formData();
    const habitName = formData.get("name") as string;

    console.log(`Creating new habit ${habitName}`);
    await createHabit({habitName, userId});

    return redirect("/habits");
}

// TODO: move inline CSS to stylesheet
export default function NewHabit() {
    return(
        <Form method="post">
            <div>
                <p style={{display:"inline-block", marginRight: "10px"}}>
                    <label>Name:{""}</label>
                    <input type="text" name="name"></input>
                </p>
                <p style={{display:"inline-block"}}>
                    <button type="submit">Create Habit</button>
                </p>
            </div>
        </Form>
    );
}