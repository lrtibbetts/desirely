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

export default function Index() {
  return (
    <div className="flex flex-col items-center">
        <h1 className="text-lg font-bold py-8">desirely</h1>
        <Link to="/login" className="bg-blue-200 hover:bg-blue-300 p-1 mb-2">log in</Link>
        <Link to="/join" className="bg-blue-200 hover:bg-blue-300 p-1">sign up</Link>
    </div>
  );
}
