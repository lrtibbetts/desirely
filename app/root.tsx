import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import NavigationBar from "./components/NavigationBar";

import sharedStylesheet from "./styles/shared.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: sharedStylesheet }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Desirely",
  viewport: "width=device-width,initial-scale=1",
});

function Document({children, title}: {children: React.ReactNode, title: string}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>{title}</title>
      </head>
      <body style={{backgroundColor:"honeydew", fontFamily: "Courier New, monospace", marginTop: "2%", marginLeft: "8%"}}>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <NavigationBar/>
        {children}
      </body>
    </html>
  )
}

// TODO: add per-route error boundaries
export function ErrorBoundary({error}: {error: Error}) {
  console.log(error.message);
  return (
    <Document title="Oh no!">
      <div>
        <h1>Something went wrong...</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  )
}

export default function App() {
  return (
    <Document title="Desirely">
      <Outlet/>
    </Document>
  )
}
