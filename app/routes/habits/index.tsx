import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getHabits, Habit } from "~/models/habit.server"

import rect from "../../assets/rect.svg";

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
    const days = getDatesOfCurrentWeek();
    return (
        <div key={habit.name}>
            <h3 style={{marginTop: "50px"}}>{habit.name}</h3>
            {getDatesOfCurrentWeek().map((date : string) => (
                <div style={{display: "inline-block", marginRight: "20px"}} key={date}>
                    <img src={rect}/>
                    <div>{dayAbbreviations[days.indexOf(date)]}</div>
                    <div>{habit.dates.includes(date) ? "COMPLETED" : null}</div>
                </div>
            ))}
        </div>
    );
}

function getDatesOfCurrentWeek() : Array<string> {
    let dates = new Array<string>
    const today = new Date();
    const monday = today.getDate() - today.getDay() + 1;
    for (let i = 0; i < 7; i++) {
        const day = new Date(today.setDate(monday + i));
        dates.push(day.toISOString().split('T')[0]);
    }
    return dates;
}