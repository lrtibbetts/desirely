import { Habit } from "~/models/habit.server";
import DailyView from "./DailyView";

export default function WeeklyView(habit: Habit) {
    const dayAbbreviations : Array<string> = [
        "M", "T", "W", "Th", "F", "S", "Su"
    ];
    const days : Array<Date> = getDatesOfCurrentWeek();
    // TODO: move inline CSS to stylesheet
    return (
        <div key={habit.habitName}>
            <h3 style={{marginTop: "50px"}}>{habit.habitName}</h3>
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

function getDatesOfCurrentWeek() : Array<Date> {
    let dates = new Array<Date>();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Will be comparing just by date, not time
    const monday = today.getDate() - today.getDay();
    for (let i = 0; i < 7; i++) { 
        const day = new Date(today.setDate(monday + i));
        dates.push(day);
    }
    return dates;
}