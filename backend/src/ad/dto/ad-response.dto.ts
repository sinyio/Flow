import { getUserExample, PaginationMetaDto } from "@/src/common/swagger-examples"
import { getUserResponse } from "@/src/user/dto"
import { ApiProperty } from "@nestjs/swagger"
import { Ad, Packaging, User } from "@prisma/client"
import { AdRoles } from "../types"

type AdWithUsers = Ad & { author: User, sender: User | null, recipient: User | null, courier: User | null }

export class AdResponseDto {

    @ApiProperty({ example: '22222222-2222-2222-2222-222222222222' })
    id: string

    @ApiProperty({ example: 'Новое объявление' })
    title: string

    @ApiProperty({ example: 'https://example.com/image.jpg' })
    image: string | null

    @ApiProperty({ example: 'Нужно доставить аккуратно' })
    description: string

    @ApiProperty({ example: 'ACTIVE' })
    status: string

    @ApiProperty({ example: '2026-03-12T00:00:00.000Z' })
    startDate: Date

    @ApiProperty({ example: '2026-03-20T00:00:00.000Z' })
    endDate: Date

    @ApiProperty({ example: 'Москва' })
    fromCity: string

    @ApiProperty({ example: 'Саратов' })
    toCity: string

    @ApiProperty({ example: 2000 })
    price: number

    @ApiProperty({ example: 0.5 })
    weight: number

    @ApiProperty({ example: true })
    isFragile: boolean

    @ApiProperty({ example: false })
    isDocument: boolean

    @ApiProperty({
        enum: Packaging,
        example: Packaging.BOX
    })
    packaging: Packaging

    @ApiProperty({ example: 40 })
    length: number

    @ApiProperty({ example: 30 })
    width: number

    @ApiProperty({ example: 20 })
    height: number

    @ApiProperty({
        example: {
            canEdit: false,
            role: AdRoles.VIEWER
        }
    })
    userState: {
        canEdit: boolean
        role: AdRoles
    }

    @ApiProperty({
        example: getUserExample()
    })
    author: any

    @ApiProperty({
        example: getUserExample(),
        nullable: true
    })
    sender: any | null

    @ApiProperty({
        example: getUserExample(),
        nullable: true
    })
    recipient: any | null

    @ApiProperty({
        example: getUserExample(),
        nullable: true
    })
    courier: any | null
}

export class AdPaginatedResponseDto {
    @ApiProperty({ type: () => [AdResponseDto] })
    data: AdResponseDto[]

    @ApiProperty({ type: PaginationMetaDto })
    meta: PaginationMetaDto
}

export const getAdResponse = (ad: AdWithUsers, userId?: string) => ({
    id: ad.id,
    deletedAt: ad.deletedAt,
    title: ad.title,
    image: ad.image,
    description: ad.description,
    status: ad.status,
    startDate: ad.startDate,
    endDate: ad.endDate,
    fromCity: ad.fromCity,
    toCity: ad.toCity,
    price: ad.price,
    weight: ad.weight,
    isFragile: ad.isFragile,
    isDocument: ad.isDocument,
    packaging: ad.packaging,
    length: ad.length,
    width: ad.width,
    height: ad.height,
    userState: {
        canEdit: ad.authorId === userId,
        role: ad.senderId === userId ? 'sender' : ad.recipientId === userId ? 'recipient' : 'viewer',
    },
    author: getUserResponse(ad.author),
    sender: ad.sender ? getUserResponse(ad.sender) : null,
    recipient: ad.recipient ? getUserResponse(ad.recipient) : null,
    courier: ad.courier ? getUserResponse(ad.courier) : null,
})