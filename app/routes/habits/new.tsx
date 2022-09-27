import { ActionArgs, ActionFunction, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import { MutableRefObject, Ref, useEffect, useRef } from "react";
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

    return null;
}

// TODO: move inline CSS to stylesheet
// TODO: replace x icon
export default function NewHabit() {
    const transition = useTransition();
    const formRef = useRef() as MutableRefObject<HTMLFormElement>;

    useEffect(() => {
        if (transition.state !== "idle") {
            formRef.current?.reset();
        }
    }), [transition.state]

    const actionData = useActionData<NewHabitActionData>() as NewHabitActionData;
    return(
        <Form ref={formRef} replace method="post" style={{display: "flex"}}>
            <input type="hidden" name="action" value="new"></input>
            <InputFieldWithError
                actionData={actionData}
                label="Name: "
                fieldName="habitName"/>
            <div style={{marginLeft: "15px"}}>
                {transition.state === "submitting" && transition.submission?.formData.get("action") === "new"
                    ? <div className="loader"></div> :
                    <div className="grow" >
                        <button type="submit">Create Habit</button>
                    </div>
                }
            </div>
            <div className="grow-text">
            <Link to="/habits" style={{marginLeft: "15px", textDecoration: "none", color: "black"}}>x</Link>
            </div>
        </Form>
    );
}