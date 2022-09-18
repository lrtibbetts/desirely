import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server"

type User = {
    email: string,
    passwordHash: string,
}

type LoginForm = {
    email: string,
    password: string,
}

export async function createUser(user: User) {
    await prisma.user.create({data: user});
}

export async function login({email, password}: LoginForm) {
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
    return { id: user.id } // TODO: return type?
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

// TODO: set NODE_ENV in production
const storage = createCookieSessionStorage({
    cookie: {
        name: "desirely_session",
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
    session.set("userId", userId);
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    });
}