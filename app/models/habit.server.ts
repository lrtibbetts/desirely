import { prisma } from "~/db.server"

export type Habit = {
    id: bigint,
    habitName: string,
    habitEntries: { entryDate: Date }[],
}

export type HabitEntry = {
    habitId: bigint,
    entryDate: Date,
}

export async function getHabits(): Promise<Array<Habit>> {
    const habits : Array<Habit> = await prisma.habit.findMany({
        select: {
            id: true,
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

export async function createHabitEntry(entry: Pick<HabitEntry, "habitId" | "entryDate">) {
    await prisma.habitEntry.create({data: entry});
}

export async function createHabit(habit: Pick<Habit, "habitName">) {
    await prisma.habit.create({data: habit});
}

export async function deleteHabitEntry(habitId: bigint, entryDate: Date) {
    await prisma.habitEntry.deleteMany({
        where: {
            habitId: habitId,
            entryDate: entryDate,
        }
    });
}