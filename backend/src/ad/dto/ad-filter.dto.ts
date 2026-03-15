
import { PaginationDto } from '@/src/common/dto'
import { Type } from 'class-transformer'
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator'

export class AdFilterDto extends PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minPrice?: number

    @IsOptional()
    @IsString()
    fromCity?: string

    @IsOptional()
    @IsString()
    toCity?: string

    @IsOptional()
    @IsDateString()
    startDate?: string

    @IsOptional()
    @IsDateString()
    endDate?: string

    @IsOptional()
    isFragile?: boolean

    @IsOptional()
    isDocument?: boolean

    @Type(() => Number)
    @IsOptional()
    maxWeight?: number
}