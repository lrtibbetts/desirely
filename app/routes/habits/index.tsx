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

    const date = new Date();
    const dateString = date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    const dayOfWeek = date.getDay();
    const dayOfWeekString = new Intl.DateTimeFormat('default', { weekday: 'long' }).format(dayOfWeek);
    console.log(dayOfWeekString)

    const userName = "Lucy"; // TODO: load user name from server
    
    return (
        <main>
            <h1>Good morning, {userName}!</h1>
            <h2>It is {dayOfWeekString}, {dateString} </h2>
            <ul>
                {habits.map((habit : Habit) => (
                    <li key={habit.name}>
                        {habit.name}
                    </li>
                ))}
            </ul>

        </main>
    )
}