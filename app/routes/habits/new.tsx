import { ActionFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { createHabit } from "~/models/habit.server";

import invariant from "tiny-invariant";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const habitName = formData.get("name");

    invariant(
        typeof habitName === "string",
        "habit name must be a string"
    );

    console.log(`creating new habit ${habitName}`);
    await createHabit({habitName});

    return redirect("/habits");
}

export default function NewHabit() {
    return(
        <Form method="post">
            <div>
                <p style={{display:"inline-block", marginRight: "10px"}}>
                    <label>Name:{""}</label>
                    <input type="text" name="name"></input>
                </p>
                <p style={{display:"inline-block"}}>
                    <button type="submit" style={{fontFamily: "Courier New, monospace"}}>Create Habit</button>
                </p>
            </div>
        </Form>
    );
}