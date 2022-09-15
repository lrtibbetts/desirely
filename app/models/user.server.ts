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

export async function createUserSession(userId: string) {

}