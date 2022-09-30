import { Form, Link } from "@remix-run/react";

export default function NavigationBar() {
    return(
        <div className="flex justify-between pt-1.5 pb-1 bg-cyan-700">
            <Link to="/" className="ml-4 hover:underline text-cyan-50 text-lg">
                <p>desirely</p>
            </Link>
            <Form action="/logout" method="post" className="mr-4 px-1 text-cyan-50 text-lg">
                <button type="submit" className="hover:underline">logout</button>                
            </Form>
        </div>
    );
}