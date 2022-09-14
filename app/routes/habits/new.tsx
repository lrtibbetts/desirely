import { ActionFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { createHabit } from "~/models/habit.server";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const habitName = formData.get("name") as string;

    console.log(`Creating new habit ${habitName}`);
    await createHabit({habitName});

    return redirect("/habits");
}

// TODO: move inline CSS to stylesheet
export default function NewHabit() {
    return(
        <Form method="post">
            <div>
                <p style={{display:"inline-block", marginRight: "10px"}}>
                    <label>Name:{""}</label>
                    <input type="text" name="name" style={{fontFamily: "Courier New, monospace"}}></input>
                </p>
                <p style={{display:"inline-block"}}>
                    <button type="submit" style={{fontFamily: "Courier New, monospace"}}>Create Habit</button>
                </p>
            </div>
        </Form>
    );
}