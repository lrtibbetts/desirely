import { Form, Link } from "@remix-run/react";


export default function NavigationBar() {
    return(
        <div style={{display: "flex", position: "relative", fontSize: "small"}}>
            <Link to="/">
                <button type="submit" style={{backgroundColor: "transparent"}}>desirely</button>
            </Link>
            <Form action="/logout" method="post" style={{position: "absolute", right: "8%"}}>
                <button type="submit" style={{backgroundColor: "transparent"}}>logout</button>
            </Form>
        </div>
    );
}