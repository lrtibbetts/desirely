import { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Habit, HabitEntry, getHabits, createHabitEntry } from "~/models/habit.server"
import WeeklyView from "~/components/WeeklyView";

import { serialize, deserialize } from "superjson";

type LoaderData = {
    habits: Array<Habit>;
}

// TODO: abstract use of superjson serialize/deserialize into wrapper
export const loader: LoaderFunction = async () => {
    return serialize({ habits: await getHabits() });
}

export default function HabitsPage() {
    const data = useLoaderData();
    const { habits }  = deserialize(data) as LoaderData;
    
    const today = new Intl.DateTimeFormat('default', { dateStyle: 'full'}).format(new Date());
    const userName = "Lucy"; // TODO: load user name from server

    return (
        <main>
            <h1>Hello, {userName}!</h1>
            <h2>It is {today}. </h2>
            <Outlet/>
            <div>
                {habits.map((habit : Habit) => (
                    WeeklyView(habit)
                ))}
            </div>
        </main>
    )
}