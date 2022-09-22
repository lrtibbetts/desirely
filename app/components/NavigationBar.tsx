import { Form, Link } from "@remix-run/react";


export default function NavigationBar() {
    return(
        <div style={{display: "flex", position: "relative", fontSize: "small"}}>
            <Link to="/">
                <div className="grow">
                    <button type="submit" style={{backgroundColor: "transparent"}}>desirely</button>
                </div>
                </Link>
            <Form action="/logout" method="post" style={{position: "absolute", right: "8%"}}>
                <div className="grow">
                    <button type="submit" style={{backgroundColor: "transparent"}}>logout</button>
                </div>                
            </Form>
        </div>
    );
}