import { ActionArgs, ActionFunction, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import InputFieldWithError from "~/components/InputFieldWithError";

import { createHabit, getHabitByUserIdHabitName } from "~/models/habit.server";
import { getUserId } from "~/models/session.server";
import { ActionData, badRequest } from "~/utils";

interface NewHabitActionData extends ActionData {
    fieldErrors?: {
        habitName: string,
    }
}

export const action: ActionFunction = async ({ request }: ActionArgs) => {
    const userId = await getUserId(request);

    const formData = await request.formData();
    const habitName = formData.get("habitName") as string;

    if (habitName.length === 0) {
        const fieldErrors = { habitName: "Please enter a name for your new habit" };
        return badRequest<NewHabitActionData>({fieldErrors});
    }

    const existingHabit = await getHabitByUserIdHabitName(userId, habitName);
    if (existingHabit) {
        const fieldErrors = {
            habitName: `${habitName} already exists`,
        }
        return badRequest<NewHabitActionData>({fieldErrors});
    }

    console.log(`Creating new habit ${habitName}`);
    await createHabit({habitName, userId});

    return redirect("/habits");
}

// TODO: move inline CSS to stylesheet
// TODO: replace x icon
export default function NewHabit() {
    const actionData = useActionData<NewHabitActionData>() as NewHabitActionData;
    return(
        <Form method="post" style={{display: "flex"}}>
            <InputFieldWithError
                actionData={actionData}
                label="Name: "
                fieldName="habitName"/>
            <div className="grow" style={{marginLeft: "15px"}}>
                <button type="submit">Create Habit</button>
            </div>
            <div className="grow-text">
            <Link to="/habits" style={{marginLeft: "15px", textDecoration: "none", color: "black"}}>x</Link>
            </div>
        </Form>
    );
}