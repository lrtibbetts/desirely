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

import tailwindStyles from "./styles/app.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStyles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Desirely",
  viewport: "width=device-width,initial-scale=1",
});

function Document({children, title}: {children: React.ReactNode, title: string}) {
  return (
    <html lang="en" className="bg-blue-100 font-mono">
      <head>
        <Meta />
        <Links />
        <title>{title}</title>
      </head>
      <body>
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
