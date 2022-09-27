import { ActionArgs, ActionFunction, LoaderArgs, LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useMatches } from "@remix-run/react";
import { Habit, getHabits, createHabitEntry, deleteHabitEntry, deleteHabit } from "~/models/habit.server"
import WeeklyView from "~/components/WeeklyView";

import { serialize, deserialize } from "superjson";
import { requireUserId } from "~/models/session.server";
import { getUserById, User } from "~/models/user.server";
import { useState } from "react";
import { useEffect } from "react";

type LoaderData = {
    habits: Array<Habit>;
    firstName: User["firstName"],
}

// TODO: abstract use of superjson serialize/deserialize into wrapper
export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
    const userId = await requireUserId(request, "/login") as string;
    const user = await getUserById(userId);

    if (!user) {
         // TODO: handle user not found
        throw new Error("No user")
    }

    return serialize({
        habits: await getHabits(userId),
        firstName: user.firstName,
    });
}

// TODO: path shouldn't change on action
export const action: ActionFunction = async ({ request }: ActionArgs) => {
    const formData = await request.formData();

    const action = formData.get("action") as string;
    const habitId = formData.get("id") as string;

    switch (action) {
        case "updateEntry":
            const dateStr = formData.get("date") as string;
            const completed = formData.get("completed") as string;
        
            const entryDate = new Date(dateStr);
        
            if (!(completed === "true")) {
                await createHabitEntry({habitId, entryDate});
            } else {
                // TODO: erasing animation?
                await deleteHabitEntry(habitId, entryDate);
            }

            return null;
        case "delete":
            await deleteHabit(habitId);
            return null;
        default:
            console.log(`Unknown action: ${action}`);
            return null;
    }
}

// TODO: don't lose date focus on page refresh - route params?
export default function HabitsPage() {
    const data = useLoaderData();
    const { habits, firstName }  = deserialize(data) as LoaderData;

    const left = "<";
    const right = ">";
    
    const [monday, setMonday] = useState(getMonday());

    const sunday = addDays(monday, 6);
    const dates = getDatesOfWeek(monday);

    const mondayStr: string = new Intl.DateTimeFormat('default', { dateStyle: 'short'}).format(monday);
    const sundayStr: string = new Intl.DateTimeFormat('default', { dateStyle: 'short'}).format(sunday);

    const lastWeek = () => {
        const lastMonday = addDays(monday, -7);
        setMonday(lastMonday);
    }

    const nextWeek = () => {
        const nextMonday = addDays(monday, 7);
        setMonday(nextMonday);
    }

    // TODO: positioning of < >
    // TODO: only show > if not on current week (?)
    return (
        <main>
            <h1>hello, {firstName}!</h1>
            <Outlet/>
            <div>
                <h3 style={{marginTop:"50px"}}>Week of {mondayStr} - {sundayStr}:</h3>
                <button onClick={lastWeek}> {left} </button>
                <button onClick={nextWeek}> {right} </button>
                {habits.map((habit : Habit) => (
                        <WeeklyView key={habit.habitName} habit={habit} days={dates}/>
                ))}
            </div>
        </main>
    )
}

function addDays(date: Date, numDays: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + numDays);
    return result;
}

function getDatesOfWeek(monday: Date) : Array<Date> {
    let dates = new Array<Date>();
    for (let i = 0; i < 7; i++) { 
        let day = addDays(monday, i);
        day.setUTCHours(0, 0, 0, 0);
        dates.push(day);
    }
    return dates;
}

function getMonday(): Date {
    let result = new Date();
    result.setDate(result.getDate() - result.getDay() + 1)
    return result;
}