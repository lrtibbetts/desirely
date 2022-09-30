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

// TODO: define variables for theme colors
export default function Index() {
  return (
    <div className="flex flex-col items-center">
        {/* <h1 className="text-lg font-bold text-cyan-700 mt-6">welcome</h1> */}
        <Link to="/login" className="rounded-md border-2 border-cyan-700 text-cyan-700 font-bold hover:bg-cyan-700 hover:text-cyan-50 hover:font-normal py-1 px-2 mt-6">log in</Link>
        <Link to="/join" className="rounded-md border-2 border-cyan-700 text-cyan-700 font-bold hover:bg-cyan-700 hover:text-cyan-50 hover:font-normal py-1 px-2 mt-3">sign up</Link>
    </div>
  );
}
