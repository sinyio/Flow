import { ApiProperty } from '@nestjs/swagger'

export class PaginationMetaDto {

    @ApiProperty({ example: 1 })
    page: number

    @ApiProperty({ example: 10 })
    limit: number

    @ApiProperty({ example: 125 })
    total: number

    @ApiProperty({ example: 13 })
    pages: number
}

export const getUserExample = () => {
    return {
        id: "123321-12dd1923-d13i-13f5v413",
        fullName: 'Иван Иванов',
        photo: "https://photoLink.ru"
    }
}