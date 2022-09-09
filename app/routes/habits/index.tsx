import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getHabits, Habit } from "~/models/habit.server"

import rect from "~/assets/rect.svg";

type LoaderData = {
    habits: Array<Habit>;
}

export const loader: LoaderFunction = async () => {
    return json<LoaderData>({
        habits: await getHabits(),
    });
}

export default function HabitsPage() {
    const { habits } = useLoaderData();

    const today = new Intl.DateTimeFormat('default', { dateStyle: 'full'}).format(new Date());
    const userName = "Lucy"; // TODO: load user name from server

    return (
        <main>
            <h1>Good morning, {userName}!</h1>
            <h2>It is {today}. </h2>
            <div>
                {habits.map((habit : Habit) => (
                    HabitLog(habit)
                ))}
            </div>
        </main>
    )
}

function HabitLog(habit: Habit) {
    const dayAbbreviations : Array<string> = [
        "M", "T", "W", "Th", "F", "S", "Su"
    ];
    const days : Array<Date> = getDatesOfCurrentWeek();
    console.log(days);
    return (
        <div key={habit.habitName}>
            <h3 style={{marginTop: "50px"}}>{habit.habitName}</h3>
            {days.map((date : Date) => (
                <div style={{display: "inline-block", marginRight: "20px"}} key={date.toISOString()}>
                    <img src={rect}/>
                    <div>{dayAbbreviations[days.indexOf(date)]}</div>
                    <div>{habit.habitEntries.find((entry) => {
                        // FIXME: why is the type string here
                        console.log(typeof(entry.entryDate));
                        return new Date(entry.entryDate).getTime() === date.getTime();
                    }) ? "COMPLETED" : null}</div>
                </div>
            ))}
        </div>
    );
}

function getDatesOfCurrentWeek() : Array<Date> {
    let dates = new Array<Date>();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Compare just by date, not time
    const monday = today.getDate() - today.getDay() + 1;
    for (let i = 0; i < 7; i++) {
        const day = new Date(today.setDate(monday + i));
        dates.push(day);
    }
    return dates;
}