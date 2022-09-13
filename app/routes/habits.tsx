import { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Habit, HabitEntry, getHabits, createHabitEntry } from "~/models/habit.server"

import rect from "~/assets/rect.svg";
import { serialize, deserialize } from "superjson";

type LoaderData = {
    habits: Array<Habit>;
}

// TODO: abstract use of superjson serialize/deserialize into wrapper
export const loader: LoaderFunction = async () => {
    return serialize({ habits: await getHabits() });
}

export default function HabitsPage() {
    const data = useLoaderData();
    const { habits }  = deserialize(data) as LoaderData;
    
    const today = new Intl.DateTimeFormat('default', { dateStyle: 'full'}).format(new Date());
    const userName = "Lucy"; // TODO: load user name from server

    return (
        <main>
            <h1>Hello, {userName}!</h1>
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

function WeeklyView(habit: Habit) {
    const dayAbbreviations : Array<string> = [
        "M", "T", "W", "Th", "F", "S", "Su"
    ];
    const days : Array<Date> = getDatesOfCurrentWeek();
    // TODO: move inline CSS to stylesheet
    return (
        <div key={habit.habitName}>
            <h3 style={{marginTop: "50px"}}>{habit.habitName}</h3>
            {days.map((date: Date) => (
                <DailyView
                    date={date}
                    habitId={habit.id}
                    completed={habit.habitEntries.find((entry: {entryDate : Date}) => {
                        return entry.entryDate.getTime() === date.getTime();
                    }) ? true : false}
                    dayAbbreviation={dayAbbreviations[days.indexOf(date)]}/>
            ))}
        </div>
    );
}

type DailyViewProps = {
    date: Date;
    habitId: bigint;
    completed: boolean;
    dayAbbreviation: string;
}

function DailyView(props: DailyViewProps) {

    // TODO: use habitId, completed to update db on click

    return(
        <div className="squiggle-container" key={props.date.toISOString()}>
                    <div>{props.completed ? <Squiggle/> : null}</div>
                    <img src={rect}/>
                    <div>{props.dayAbbreviation}</div>
                </div>
    );
}

function getDatesOfCurrentWeek() : Array<Date> {
    let dates = new Array<Date>();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Will be comparing just by date, not time
    const monday = today.getDate() - today.getDay();
    for (let i = 0; i < 7; i++) { 
        const day = new Date(today.setDate(monday + i));
        dates.push(day);
    }
    return dates;
}

function Squiggle() {
    return(
      <svg
        className="squiggle"
        width="12.969591mm"
        height="13.527871mm"
        viewBox="0 0 12.969591 13.527871"
        version="1.1"
        id="svg11427"
        xmlns="http://www.w3.org/2000/svg">
        <g
          id="layer1"
          transform="translate(-59.645355,-23.342412)">
          <path
            d="m 63.205916,24.076575 c -8.915859,9.68845 3.156079,-0.83696 3.395655,-0.597384 0.437231,0.437231 -14.906492,17.6916 -0.943238,4.370334 0.783827,-0.747789 3.225128,-3.395655 4.621864,-3.395655 1.610357,0 -12.676576,11.784269 -9.80967,12.262087 3.167638,0.52794 8.011927,-8.791371 10.784349,-10.375613 2.336876,-1.335357 -8.003967,6.123237 -6.979958,9.809671 0.556076,2.001872 7.071939,-6.363175 8.174726,-5.627984 0.627347,0.418231 -8.015621,8.873537 -0.50306,4.401775"
            id="path22968" />
        </g>
      </svg>
    )
  }