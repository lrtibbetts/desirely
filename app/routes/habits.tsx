import { ActionArgs, ActionFunction, LoaderArgs, LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useMatches } from "@remix-run/react";
import { Habit, getHabits, createHabitEntry, deleteHabitEntry, deleteHabit } from "~/models/habit.server"
import WeeklyView from "~/components/WeeklyView";

import { serialize, deserialize } from "superjson";
import { requireUserId } from "~/models/session.server";
import { getUserById, User } from "~/models/user.server";

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

export default function HabitsPage() {
    const data = useLoaderData();
    const { habits, firstName }  = deserialize(data) as LoaderData;
    
    const dates = getDatesOfCurrentWeek();
    const start = new Intl.DateTimeFormat('default', { dateStyle: 'short'}).format(dates[0]);
    const end = new Intl.DateTimeFormat('default', { dateStyle: 'short'}).format(dates[6]);

    return (
        <main>
            <h1>hello, {firstName}!</h1>
            <Outlet/>
            <div>
                <h3 style={{marginTop:"50px"}}>Week of {start} - {end}:</h3>
                {habits.map((habit : Habit) => (
                    <WeeklyView key={habit.habitName} habit={habit} days={getDatesOfCurrentWeek()}/>
                ))}
            </div>
        </main>
    )
}

function getDatesOfCurrentWeek() : Array<Date> {
    let dates = new Array<Date>();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Will be comparing just by date, not time
    const monday = today.getDate() - today.getDay();
    for (let i = 1; i <= 7; i++) { 
        const day = new Date(today.setDate(monday + i));
        dates.push(day);
    }
    return dates;
}