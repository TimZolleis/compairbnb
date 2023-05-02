import bcrypt from 'bcrypt';
import { prisma } from '../../../prisma/db';
import { use } from 'ast-types';

interface CreateUserProps {
    name: string;
    password: string;
    email: string;
}

export async function loginUser(username: string, password: string) {
    const user = await prisma.user.findUnique({
        where: {
            name: username,
        },
    });
    if (!user) {
        throw new Error('The user does not exist');
    }
    const matchesPassword = await bcrypt.compare(password, user.password);
    if (!matchesPassword) {
        throw new Error('The provided credentials are wrong');
    }
    return user;
}

export async function createUser({ name, password, email }: CreateUserProps) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
        data: {
            name,
            password: hashedPassword,
            email,
        },
    });
}

export async function deleteUser(id: string) {
    return prisma.user.delete({
        where: {
            id,
        },
    });
}
