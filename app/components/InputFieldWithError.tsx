import { ActionData } from "~/utils";

export type InputFieldWithErrorProps<T extends ActionData> = {
    actionData: T,
    label: string,
    fieldName: string,
    isPassword?: boolean,
}

export default function InputFieldWithError<T extends ActionData>({ actionData, label, fieldName, isPassword = false } : InputFieldWithErrorProps<T>) {
    return(
        <p>
            <label>{label}
            <input 
                type={isPassword ? "password" : "text"} name={fieldName} style={{width: "200px"}}
                aria-invalid={actionData?.fieldErrors?.[fieldName] ? true : undefined}
                aria-errormessage={
                    actionData?.fieldErrors?.[fieldName] ? `${fieldName}-error` : undefined}/>
                </label>
                {actionData?.fieldErrors?.[fieldName] ? (
                <p style={{fontSize: "small"}} id="lastNameError">
                    {actionData.fieldErrors?.[fieldName]}
                </p>) : null}
        </p>
    );
}