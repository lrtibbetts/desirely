import { Form, useTransition } from "@remix-run/react";
import { Habit } from "~/models/habit.server";
import DailyView from "./DailyView";

type WeeklyViewProps = {
    habit: Habit,
    days: Array<Date>,
}

export default function WeeklyView({ habit, days } : WeeklyViewProps) {
    const dayAbbreviations : Array<string> = [
        "M", "T", "W", "Th", "F", "S", "Su"
    ];

    const transition = useTransition();
    
    // TODO: positioning, hover for x
    // TODO: make habit editable
    return (
        <div key={habit.id}>
            {transition.submission?.formData.get("action") === "delete"
            && transition.submission?.formData.get("id") === habit.id ? null :
                <div className="bg-blue-200 rounded-md pl-4 pr-3 py-3 mt-4">
                    <div className="flex justify-between">
                        <h3 className="text-lg font-bold">{habit.habitName}</h3>
                        <Form method="post">
                            <input type="hidden" name="action" value="delete"></input>
                            <input type="hidden" name="id" value={habit.id.toString()}/>
                            <button type="submit" className="text-lg rounded-sm px-1 hover:bg-blue-300">
                                <h3>x</h3>
                            </button>
                        </Form>
                    </div>
                    <div className="flex justify-between mt-3">
                        {days.map((date: Date) => (
                            <DailyView
                                key={`${habit.id}-${date.toISOString()}`}
                                date={date}
                                habitId={habit.id}
                                completed={habit.habitEntries.find((entry: {entryDate : Date}) => {
                                    return entry.entryDate.getTime() === date.getTime();
                                }) ? true : false}
                                dayAbbreviation={dayAbbreviations[days.indexOf(date)]}/>
                        ))}
                    </div>
                    
                </div>
            }
        </div>
    );
}