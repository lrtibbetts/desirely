import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server"

const sessionSecretName = "SESSION_SECRET";
const cookieName = "desirely_session";
const userIdName = "userId";

type User = {
    email: string,
    passwordHash: string,
}

export async function createUser(user: User) {
    await prisma.user.create({data: user});
}

export async function login(email: string, password: string) {
    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    });
    if (!user) {
        // TODO
        return null;
    }

    const correctPassword = await bcrypt.compare(
        password,
        user.passwordHash
    );
    if (!correctPassword) {
        // TODO
    }
    return user.id; // TODO: need anything other than id? probably return object later
}

const sessionSecret = process.env[sessionSecretName];
if (!sessionSecret) {
    throw new Error(`${sessionSecretName} must be set`);
}

// TODO: set NODE_ENV in production
const storage = createCookieSessionStorage({
    cookie: {
        name: cookieName,
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true
    }
})

export async function createUserSession(userId: string, redirectTo: string) {
    const session = await storage.getSession();
    session.set(userIdName, userId);
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    });
}

export async function getUserSession(request: Request) {
    return storage.getSession(request.headers.get("Cookie"));
}

async function getUserId(request: Request) {
    const session = await getUserSession(request);
    const userId = session.get(userIdName);
    
    if (!userId || typeof userId !== "string") {
        return null;
    }
    return userId;
}

export async function requireUserId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname
) {
        const userId = getUserId(request);
        if (!userId) {
            const searchParams = new URLSearchParams([
                ["redirectTo", redirectTo],
              ]);
              throw redirect(`/login?${searchParams}`);
        }
    return userId; 
}