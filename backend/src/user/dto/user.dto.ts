import { User } from "@prisma/client";

export const getUserResponse = (user: User) => ({
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`,
    photo: user.photo ?? null,
})