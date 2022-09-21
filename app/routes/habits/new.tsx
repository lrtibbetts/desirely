import { ActionArgs, ActionFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
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
    console.log(userId);

    const formData = await request.formData();
    const habitName = formData.get("habitName") as string;

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
// TODO: error handling if habit already exists
export default function NewHabit() {
    const actionData = useActionData<NewHabitActionData>() as NewHabitActionData;
    return(
        <Form method="post">
            <div>
                <InputFieldWithError
                    actionData={actionData}
                    label="Name "
                    fieldName="habitName"/>
                <p style={{display:"inline-block"}}>
                    <button type="submit">Create Habit</button>
                </p>
            </div>
        </Form>
    );
}