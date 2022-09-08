import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getHabits, Habit } from "~/models/habit.server"

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
            <h2>It is {today} </h2>
            <ul>
                {habits.map((habit : Habit) => (
                    Habit(habit)
                ))}
            </ul>

        </main>
    )
}

function Habit(habit: Habit) {
    const dayAbbreviations : Array<String> = [
        "M", "T", "W", "Th", "F", "S", "Su"
    ];
    return (
        <li key={habit.name}>
            {habit.name}
        </li>
    );
}