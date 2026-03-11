import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdService {
  constructor(private readonly prisma: PrismaService) { }

  public async findAdById(id: string) {
    console.log(id)
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    console.log(ad)

    if (!ad) throw new NotFoundException('Объявление не найдено')

    return ad
  }

}
