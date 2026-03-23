import { ApiPropertyOptional } from "@nestjs/swagger"
import { Gender } from "@prisma/client"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { Transform } from 'class-transformer'

export class UpdateProfileDto {
    @ApiPropertyOptional({example: ''})
    @IsOptional()
    @IsString()
    firstName?: string

    @ApiPropertyOptional({example: ''})
    @IsOptional()
    @IsString()
    lastName?: string

    @ApiPropertyOptional({ example: '', enum: Gender })
    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsEnum(Gender)
    gender?: Gender

    @ApiPropertyOptional({ example: '', description: 'ISO, например 2026-03-12 или 2026-03-12T00:00:00.000Z' })
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    dateOfBirth?: Date

    @IsString()
    @ApiPropertyOptional({ example: '' })
    contacts?: string

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    @IsOptional()
    photo?: any
}