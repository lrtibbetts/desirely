import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import { MutableRefObject, useEffect, useRef } from "react";

import { ActionData } from "~/utils";
import InputFieldWithError from "./InputFieldWithError";

interface NewHabitActionData extends ActionData {
    fieldErrors?: {
        habitName: string,
    }
}

// TODO: clear any errors when form is hidden/clicked again
// TODO: only display Create Habit button if text has been entered (prevent empty input)
export default function NewHabit() {
    const transition = useTransition();
    const formRef = useRef() as MutableRefObject<HTMLFormElement>;

    useEffect(() => {
        if (transition.state === "submitting" && transition.submission?.formData.get("action") === "new") {
            formRef.current?.reset();
        }
    }), [transition.state]

    // TODO: loader with tailwind
    const actionData = useActionData<NewHabitActionData>() as NewHabitActionData;
    return(
        <Form className="flex" ref={formRef} method="post">
            <input type="hidden" name="action" value="new"></input>
            <InputFieldWithError
                actionData={actionData}
                label="name:"
                fieldName="habitName"/>
            <button type="submit" className="mt-3 ml-3 underline">create habit</button>
            {/* <div>
                {transition.state === "submitting" && transition.submission?.formData.get("action") === "new"
                    ? <div className="loader"></div> :
                    <button type="submit">Create Habit</button>
                }
            </div> */}
        </Form>
    );
}