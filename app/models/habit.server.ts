
export type { Habit };

type Habit = {
    name: string;
    dates: Array<string>;
}

export async function getHabits(): Promise<Array<Habit>> {
    let date = new Date();
    console.log(date.toUTCString());

    let run: Habit = {
        name: "run",
        dates: [ "2022-09-08", "2022-09-05" ]
    }
    let cook: Habit = {
        name: "cook dinner",
        dates: [ "2022-09-08" ]
    }
    let yoga: Habit = {
        name: "yoga",
        dates: [ "2022-09-07", "2022-09-06" ]
    }
    return [ run, cook, yoga ];
}