
type Habit = {
    name: string;
    date: string;
}

export async function getHabits(): Promise<Array<Habit>> {
    let mockedHabit: Habit = {
        name: "run",
        date: "2022-09-06T22:59:54Z"
    }
    return [ mockedHabit ];
}