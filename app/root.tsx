import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import sharedStylesheet from "./styles/shared.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: sharedStylesheet }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Desirely",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{backgroundColor:"honeydew", fontFamily: "Courier New, monospace", marginTop: "7%", marginLeft: "8%"}}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
