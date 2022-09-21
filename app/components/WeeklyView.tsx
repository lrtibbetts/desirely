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
    // TODO: move inline CSS to stylesheet
    return (
        <div key={habit.habitName}>
            <h3 style={{marginTop: "25px"}}>{habit.habitName}</h3>
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