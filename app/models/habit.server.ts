
export type { Habit };

type Habit = {
    name: string;
    date: string;
}

export async function getHabits(): Promise<Array<Habit>> {
    let run: Habit = {
        name: "run",
        date: "2022-09-06T22:59:54Z"
    }
    let cook: Habit = {
        name: "cook dinner",
        date: "2022-09-05T22:59:54Z"
    }
    return [ run, cook ];
}