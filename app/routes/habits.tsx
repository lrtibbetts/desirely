import { ActionArgs, ActionFunction, LoaderArgs, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Habit, getHabits, createHabitEntry, deleteHabitEntry } from "~/models/habit.server"
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

export const action: ActionFunction = async ({ request }: ActionArgs) => {
    const formData = await request.formData();

    const dateStr = formData.get("date") as string;
    const habitId = formData.get("id") as string;
    const completed = formData.get("completed") as string;

    const entryDate = new Date(dateStr);

    if (!(completed === "true")) {
        await createHabitEntry({habitId, entryDate});
    } else {
        // TODO: erasing animation?
        await deleteHabitEntry(habitId, entryDate);
    }

    return null;
}

export default function HabitsPage() {
    const data = useLoaderData();
    const { habits, firstName }  = deserialize(data) as LoaderData;
    
    const today = new Intl.DateTimeFormat('default', { dateStyle: 'full'}).format(new Date());

    return (
        <main>
            <h1>Hello, {firstName}!</h1>
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