import { Form, useTransition } from "@remix-run/react";
import { Habit } from "~/models/habit.server";
import DailyView from "./DailyView";

type WeeklyViewProps = {
    habit: Habit,
    days: Array<Date>,
}

export default function WeeklyView({ habit, days} : WeeklyViewProps) {
    const dayAbbreviations : Array<string> = [
        "M", "T", "W", "Th", "F", "S", "Su"
    ];

    const transition = useTransition();
    
    // TODO: move inline CSS to stylesheet
    // TODO: positioning, hover for x
    return (
        <div key={habit.habitName}>
            <div style={{marginTop: "25px", display: "flex"}}>
                <Form method="post">
                    <input type="hidden" name="action" value="delete"></input>
                    <input type="hidden" name="id" value={habit.id.toString()}/>
                    <button type="submit" className="day-button" disabled={transition.state != "idle"}>
                        <h3>x</h3>
                    </button>
                </Form>
                <h3>{habit.habitName}</h3>
            </div>
            {days.map((date: Date) => (
                <DailyView
                    key={date.toISOString()}
                    date={date}
                    habitId={habit.id}
                    completed={habit.habitEntries.find((entry: {entryDate : Date}) => {
                        return entry.entryDate.getTime() === date.getTime();
                    }) ? true : false}
                    dayAbbreviation={dayAbbreviations[days.indexOf(date)]}/>
            ))}
        </div>
    );
}