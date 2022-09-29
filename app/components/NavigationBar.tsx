import { Form, Link } from "@remix-run/react";

export default function NavigationBar() {
    return(
        <div className="flex justify-between mt-3">
            <Link to="/" className="ml-4 px-1 hover:underline">
                <p>desirely</p>
            </Link>
            <Form action="/logout" method="post" className="mr-4 px-1">
                <button type="submit" className="hover:underline">logout</button>                
            </Form>
        </div>
    );
}