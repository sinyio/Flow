import { User } from "@prisma/client";

export const getUserResponse = (user: User) => ({
    id: user.id,
    photo: user.photo ?? null,
})