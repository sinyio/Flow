import { User } from "@prisma/client";

export const getUserResponse = (user: User) => ({
    id: user.id,
    fullName: user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName ?? user.lastName ?? 'Неизвестный пользователь',
    photo: user.photo ?? null,
    deletedAt: user.deletedAt,
    courierRating: user.courierRating,
    customerRating: user.customerRating,
})