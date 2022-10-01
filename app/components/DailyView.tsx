import { Form, useTransition } from "@remix-run/react";
import { useState } from "react";
import rect from "~/assets/rect.svg";

type DailyViewProps = {
    date: Date;
    habitId: string;
    completed: boolean;
    dayAbbreviation: string;
}

// TODO: make black text dark cyan
// TODO render day abbrev
export default function DailyView({date, habitId, completed, dayAbbreviation}: DailyViewProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(completed);

    const transition = useTransition();

    // FIXME: have margin but keep aspect-square
    // FIXME: extra whitespace below button - why???
    return(
        <Form method="post" className="border-2 border-black rounded-md w-1/6 aspect-square mr-2">
            <input type="hidden" name="action" value="updateEntry"/>
            <input type="hidden" name="completed" value={completed.toString()}/>
            <input type="hidden" name="date" value={date.toISOString()}/>
            <input type="hidden" name="id" value={habitId.toString()}/>
            <button
                type="submit"
                disabled={transition.state != "idle"}
                onClick={() => {
                    setIsVisible(!isVisible);
                    setIsAnimating(true);
                }}>
                <Squiggle visible={isVisible} animating={isAnimating}/>
            </button>
            {/* <div>{dayAbbreviation}</div> */}
        </Form>
    );
}

type SquiggleProps = {
    visible: boolean;
    animating: boolean;
}

function Squiggle({visible, animating}: SquiggleProps) {
    return(
        <svg
            className=
                {visible && animating ? "squiggle visible animating" : 
                (visible ? "squiggle visible" : "squiggle")}
            width="100%"
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