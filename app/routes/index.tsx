import { Link } from "@remix-run/react";

// TODO: move CSS to stylesheet
export default function Index() {
  return (
    <div style={{lineHeight: "1.25", textAlign: "center"}}>
        <h1>Desirely</h1>
        <div style={{display:"flex", alignItems: "center", flexDirection:"column"}}>
            <Link
                to="/login"
                >
                    Login
            </Link>
            <Link
                to="/login"
                >
                    Sign up
            </Link>
        </div>
    </div>
  );
}
