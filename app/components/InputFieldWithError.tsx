import { ActionData } from "~/utils";

export type InputFieldWithErrorProps<T extends ActionData> = {
    actionData: T,
    label: string,
    fieldName: string,
    isPassword?: boolean,
}

// TODO: leave room for potential error message so elements don't shift
export default function InputFieldWithError<T extends ActionData>({ actionData, label, fieldName, isPassword = false } : InputFieldWithErrorProps<T>) {
    return(
        <div style={{marginBottom:"10px"}}>
            <label>{label}
            <input 
                type={isPassword ? "password" : "text"} name={fieldName} style={{width: "225px"}}
                aria-invalid={actionData?.fieldErrors?.[fieldName] ? true : undefined}
                aria-errormessage={
                    actionData?.fieldErrors?.[fieldName] ? `${fieldName}-error` : undefined}/>
                </label>
                {actionData?.fieldErrors?.[fieldName] ? (
                <div style={{fontSize: "small", marginTop: "5px"}} id={`${fieldName}-error`}>
                    {actionData.fieldErrors?.[fieldName]}
                </div>) : null}
        </div>
    );
}