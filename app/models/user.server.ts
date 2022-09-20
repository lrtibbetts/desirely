import bcrypt from "bcryptjs";

import { prisma } from "~/db.server"

export type User = {
    id: string,
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
}

export async function getUserByEmail(email: User["email"]) {
    return prisma.user.findUniqueOrThrow({where: { email }});
}

export async function getUserById(id: User["id"]) {
    return prisma.user.findUniqueOrThrow({where: { id }});
}

export async function createUser(user: Pick<User, "email" | "firstName" | "lastName">, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    const userData = {...user, passwordHash}

    return await prisma.user.create({
        data: userData
    });
}

export async function login(email: User["email"], password: string) {
    const user = await prisma.user.findUniqueOrThrow({
        where: { email },
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
        return null;
    }
    return user.id; // TODO: need anything other than id? probably return object later
}