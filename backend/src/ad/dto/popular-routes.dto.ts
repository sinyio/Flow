import { ApiProperty } from "@nestjs/swagger"
import { AdResponseDto } from "./ad.dto"

export class PopularRoutesResponseDto {
  @ApiProperty({ example: 'Москва' })
  fromCity: string
  @ApiProperty({ example: 'Саратов' })
  toCity: string
  @ApiProperty({ example: 10 })
  totalAds: number
  @ApiProperty({ type: [AdResponseDto] })
  latestAds: AdResponseDto[]
}