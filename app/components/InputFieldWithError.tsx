import { ActionData } from "~/utils";

export type InputFieldWithErrorProps<T extends ActionData> = {
    actionData: T,
    label: string,
    fieldName: string,
    isPassword?: boolean,
}

// TODO: error message styling
// TODO: remove styling from component? easy to forget about here
export default function InputFieldWithError<T extends ActionData>({ actionData, label, fieldName, isPassword = false } : InputFieldWithErrorProps<T>) {
    return(
        <div className="flex flex-row mt-3 w-80">
            <label className="mr-2">{label}</label>
            <input
                className="grow text-sm rounded-md bg-slate-200 pl-2 focus:bg-slate-300 outline-none"
                type={isPassword ? "password" : "text"}
                name={fieldName}
                aria-invalid={actionData?.fieldErrors?.[fieldName] ? true : undefined}
                aria-errormessage={actionData?.fieldErrors?.[fieldName] ? `${fieldName}-error` : undefined}
            />
            {actionData?.fieldErrors?.[fieldName] ? 
                <div id={`${fieldName}-error`}>
                    {actionData.fieldErrors?.[fieldName]}
                </div> : null}
        </div>
    );
}