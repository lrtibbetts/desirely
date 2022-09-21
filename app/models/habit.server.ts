import { prisma } from "~/db.server"
import { User } from "./user.server";

export type Habit = {
    id: string,
    userId: string,
    habitName: string,
    habitEntries: { entryDate: Date }[],
}

export type HabitEntry = {
    habitId: string,
    entryDate: Date,
}

export async function getHabits(userId: User["id"]): Promise<Array<Habit>> {
    const habits : Array<Habit> = await prisma.habit.findMany({
        where: { userId: userId },
        select: {
            id: true,
            userId: true,
            habitName: true,
            habitEntries: {
                select: {
                    entryDate: true
                }
            }
        }
    });
    
    return habits;
}

export async function getHabitByUserIdHabitName(userId: User["id"], habitName: Habit["habitName"]) {
    const habit = await prisma.habit.findUnique({
        where: { userId_habitName: { userId, habitName }
    }});
    return habit;
}

export async function createHabitEntry(entry: Pick<HabitEntry, "habitId" | "entryDate">) {
    await prisma.habitEntry.create({data: entry});
}

export async function createHabit(habit: Pick<Habit, "habitName" | "userId">) {
    await prisma.habit.create({data: habit});
}

export async function deleteHabitEntry(habitId: string, entryDate: Date) {
    await prisma.habitEntry.deleteMany({
        where: {
            habitId: habitId,
            entryDate: entryDate,
        }
    });
}