import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { getAdResponse } from './dto/ad.dto'

@Injectable()
export class AdService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAdById(id: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!ad) throw new NotFoundException('Объявление не найдено')

    return getAdResponse(ad)
  }
}
