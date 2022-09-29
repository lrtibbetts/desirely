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
                <div>
                    <Form method="post">
                        <input type="hidden" name="action" value="delete"></input>
                        <input type="hidden" name="id" value={habit.id.toString()}/>
                        <button type="submit" className="day-button">
                            <h3>x</h3>
                        </button>
                    </Form>
                    <h3 className="text-lg">{habit.habitName}</h3>
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
            }
        </div>
    );
}