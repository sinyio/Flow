import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateComplaintDto, GetComplaintsQueryDto } from './dto'

@Injectable()
export class AdminService {
  public constructor(private readonly prisma: PrismaService) {}

  public async createComplaint(authorId: string, dto: CreateComplaintDto) {
    return this.prisma.complaint.create({
      data: {
        type: dto.type,
        text: dto.text,
        authorId,
        targetUserId: dto.targetUserId,
        targetAdId: dto.targetAdId,
        targetPostId: dto.targetPostId,
      },
    })
  }

  public async getComplaints(query: GetComplaintsQueryDto) {
    const { type, page = 1, limit = 20 } = query
    const where = type ? { type } : {}

    const [data, total] = await Promise.all([
      this.prisma.complaint.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, firstName: true, lastName: true, photo: true } },
          targetUser: { select: { id: true, firstName: true, lastName: true, photo: true } },
          targetAd: { select: { id: true, title: true } },
          targetPost: { select: { id: true, title: true } },
        },
      }),
      this.prisma.complaint.count({ where }),
    ])

    return { data, total, page, limit }
  }
}
