import { prisma } from "~/db.server"

export type Habit = {
    habitName: string,
    habitEntries: { entryDate: Date }[],
}

export async function getHabits(): Promise<Array<Habit>> {
    const habits : Array<Habit> = await prisma.habit.findMany({
        select: {
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