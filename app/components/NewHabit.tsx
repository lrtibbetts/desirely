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
export default function NewHabit() {
    const transition = useTransition();
    const formRef = useRef() as MutableRefObject<HTMLFormElement>;

    useEffect(() => {
        if (transition.state === "submitting" && transition.submission?.formData.get("action") === "new") {
            formRef.current?.reset();
        }
    }), [transition.state]

    const actionData = useActionData<NewHabitActionData>() as NewHabitActionData;
    return(
        <Form ref={formRef} method="post" style={{display: "flex"}}>
            <input type="hidden" name="action" value="new"></input>
            <InputFieldWithError
                actionData={actionData}
                label="Name: "
                fieldName="habitName"/>
            <div style={{marginLeft: "15px"}}>
                {transition.state === "submitting" && transition.submission?.formData.get("action") === "new"
                    ? <div className="loader"></div> :
                    <div>
                        <span className="grow" >
                            <button type="submit">Create Habit</button>
                        </span>
                    </div>
                }
            </div>
        </Form>
    );
}