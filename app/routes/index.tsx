import { LoaderArgs, LoaderFunction, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { getUserId } from "~/models/session.server";

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/habits");
  }
  return {};
}

// TODO: move CSS to stylesheet
export default function Index() {
  return (
    <div style={{lineHeight: "1.25", textAlign: "center"}}>
        <h1>Desirely</h1>
        <div style={{display:"flex", alignItems: "center", flexDirection:"column"}}>
            <Link to="/login">Log in</Link>
            <Link to="/join">Sign up</Link>
        </div>
    </div>
  );
}
