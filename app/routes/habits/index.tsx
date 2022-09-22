import { Link } from "react-router-dom";

export default function HabitIndex() {
    return(
        <p>
            <Link to="new" type="get" style={{color:"black"}}>Create a new habit.</Link>
        </p>
    )
}