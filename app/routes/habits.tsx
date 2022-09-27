import { ActionArgs, ActionFunction, LoaderArgs, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { serialize, deserialize } from "superjson";

import { Habit, getHabits, createHabitEntry, deleteHabitEntry, deleteHabit, getHabitByUserIdHabitName, createHabit } from "~/models/habit.server";
import { getUserId, requireUserId } from "~/models/session.server";
import { getUserById, User } from "~/models/user.server";
import { ActionData, badRequest } from "~/utils";
import WeeklyView from "~/components/WeeklyView";

type LoaderData = {
    habits: Array<Habit>;
    firstName: User["firstName"],
}

interface NewHabitActionData extends ActionData {
    fieldErrors?: {
        habitName: string,
    }
}

const left = "<";
const right = ">";

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
    const userId = await getUserId(request);

    const action = formData.get("action") as string;
    let habitId;

    switch (action) {
        case "updateEntry":
            habitId = formData.get("id") as string;
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
        case "new":
            const habitName = formData.get("habitName") as string;

            if (habitName.length === 0) {
                const fieldErrors = { habitName: "Please enter a name for your new habit" };
                return badRequest<NewHabitActionData>({fieldErrors});
            }
        
            const existingHabit = await getHabitByUserIdHabitName(userId, habitName);
            if (existingHabit) {
                const fieldErrors = {
                    habitName: `${habitName} already exists`,
                }
                return badRequest<NewHabitActionData>({fieldErrors});
            }
        
            console.log(`Creating new habit ${habitName}`);
            await createHabit({habitName, userId});

            return null;
        case "delete":
            habitId = formData.get("id") as string;
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
    
    const [monday, setMonday] = useState(new BetterDate().getMonday());

    const lastWeek = () => {
        setMonday(monday.addDays(-7));
    }

    const nextWeek = () => {
        setMonday(monday.addDays(7));
    }

    // TODO: positioning of < >
    // TODO: only show > if not on current week (?)
    return (
        <main>
            <h1>hello, {firstName}!</h1>
            <Outlet/>
            <div>
                <h3 style={{marginTop:"50px"}}>Week of {monday.toString()} - {monday.addDays(6).toString()}:</h3>
                <button onClick={lastWeek}> {left} </button>
                <button onClick={nextWeek}> {right} </button>
                {habits.map((habit : Habit) => (
                        <WeeklyView key={habit.habitName} habit={habit} days={monday.getDatesOfWeek()}/>
                ))}
            </div>
        </main>
    )
}

class BetterDate extends Date {
    addDays(numDays: number): BetterDate {
        let result = new BetterDate(this);
        result.setDate(result.getDate() + numDays);
        return result;
    }

    toString(): string {
        return new Intl.DateTimeFormat('default', { dateStyle: 'short'}).format(this);
    }

    getDatesOfWeek() : Array<BetterDate> {
        let dates = new Array<BetterDate>();
        for (let i = 0; i < 7; i++) { 
            let day = this.addDays(i);
            day.setUTCHours(0, 0, 0, 0);
            dates.push(day);
        }
        return dates;
    }

    // FIXME: will be wrong Monday on Sunday
    getMonday(): BetterDate {
        let result = new BetterDate();
        result.setDate(result.getDate() - result.getDay() + 1)
        return result;
    }
}