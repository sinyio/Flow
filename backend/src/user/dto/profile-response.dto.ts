import { ApiProperty } from "@nestjs/swagger"
import { Gender, UserRole } from "@prisma/client"

export class ProfileResponseDto {
    @ApiProperty({ example: '11111111-1111-1111-1111-111111111111' })
    id: string
    @ApiProperty({ example: 'Иван' })
    firstName: string | null
    @ApiProperty({ example: 'Иванов' })
    lastName: string | null
    @ApiProperty({ example: 'https://example.com/photo.jpg' })
    photo: string
    // @ApiProperty({ example: '+79999999999' })
    // phoneNumber: string
    // @ApiProperty({ example: 'user@example.com' })
    // email: string
    // @ApiProperty({ example: true })
    // isVerified: boolean
    // role: UserRole
    @ApiProperty({ example: '2026-03-12T00:00:00.000Z' })
    registeredAt: Date
    @ApiProperty({ example: '2026-03-12T00:00:00.000Z' })
    deletedAt: Date | null
    @ApiProperty({ example: 34 })
    successfulDeliveriesCount: number
    @ApiProperty({ example: 10 })
    authoredAdsCount: number
    @ApiProperty({ example: 23 })
    receivedReviewsCount: number
    @ApiProperty({ example: 7 })
    authoredReviewsCount: number

    @ApiProperty({ example: 4.8, description: 'Средняя оценка как курьер' })
    courierRating: number

    @ApiProperty({ example: 4.2, description: 'Средняя оценка как заказчик' })
    customerRating: number

    @ApiProperty({ example: 'MALE' })
    gender: Gender | null

    @ApiProperty({ example: '2026-03-12T00:00:00.000Z' })
    dateOfBirth: Date | null

    @ApiProperty({
        example: {
            canEdit: false,
        }
    })
    userState: {
        canEdit: boolean
    }
}


