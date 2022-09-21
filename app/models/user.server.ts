import { redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server"
import { getUserSession } from "./session.server";

export type User = {
    id: string,
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
}

export type LoginResult = {
    error?: string,
    userId?: string,
}

export async function getUserByEmail(email: User["email"]) {
    return prisma.user.findUnique({where: { email }});
}

export async function getUserById(id: User["id"]) {
    return prisma.user.findUnique({where: { id }});
}

export async function createUser(user: Pick<User, "email" | "firstName" | "lastName">, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    const userData = {...user, passwordHash}

    return await prisma.user.create({
        data: userData
    });
}

// TODO: move session logic into login? (same for sign up)
export async function login(email: User["email"], password: string) : Promise<LoginResult> {
    let result : LoginResult;

    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        result = { error: `No user found with email ${email}`}
        return result;
    }

    const correctPassword = await bcrypt.compare(
        password,
        user.passwordHash
    );
    if (!correctPassword) {
        result = { error: "Incorrect password" }
        return result;
    }

    result = { userId: user.id }
    return result;
}

export async function logout(request: Request) {
    const session = await getUserSession(request);
    return redirect("/", {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
          },
    });
}