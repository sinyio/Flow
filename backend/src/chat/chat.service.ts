import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '@/src/prisma/prisma.service'

@Injectable()
export class ChatService {
  public constructor(private readonly prisma: PrismaService) {}

  public async getMyChats(userId?: string, page = 1, limit = 20, q?: string) {
    if (!userId) throw new UnauthorizedException('Сессия не найдена')

    const skip = (page - 1) * limit

    const where: any = {
      members: {
        some: {
          userId,
        },
      },
    }

    if (q && q.trim().length > 0) {
      where.OR = [
        { messages: { some: { text: { contains: q, mode: 'insensitive' } } } },
        {
          members: {
            some: {
              user: {
                OR: [
                  { email: { contains: q, mode: 'insensitive' } },
                  { firstName: { contains: q, mode: 'insensitive' } },
                  { lastName: { contains: q, mode: 'insensitive' } },
                ],
              },
            },
          },
        },
      ]
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.chat.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        include: {
          ad: true,
          members: {
            include: {
              user: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              sender: true,
              files: true,
            },
          },
        },
      }),
      this.prisma.chat.count({ where }),
    ])

    const data = items.map((chat) => {
      const otherMember = chat.members.find((m) => m.userId !== userId)

      return {
        id: chat.id,
        adId: chat.adId,
        responseId: chat.responseId,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        ad: {
          id: chat.ad.id,
          title: chat.ad.title,
          status: chat.ad.status,
          image: chat.ad.image,
        },
        otherUser: otherMember
          ? {
              id: otherMember.user.id,
              email: otherMember.user.email,
              firstName: otherMember.user.firstName,
              lastName: otherMember.user.lastName,
              photo: otherMember.user.photo,
            }
          : null,
        lastMessage: chat.messages[0]
          ? {
              id: chat.messages[0].id,
              text: chat.messages[0].text,
              createdAt: chat.messages[0].createdAt,
              senderId: chat.messages[0].senderId,
              filesCount: chat.messages[0].files.length,
            }
          : null,
      }
    })

    return {
      data,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  public async getChatMessages(userId: string | undefined, chatId: string, page = 1, limit = 50) {
    if (!userId) throw new UnauthorizedException('Сессия не найдена')

    const isMember = await this.prisma.chatMember.findUnique({
      where: {
        chatId_userId: {
          chatId,
          userId,
        },
      },
    })

    if (!isMember) throw new NotFoundException('Чат не найден')

    const skip = (page - 1) * limit

    const [messages, total] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          sender: true,
          files: true,
        },
      }),
      this.prisma.message.count({ where: { chatId } }),
    ])

    const data = messages
      .slice()
      .reverse()
      .map((m) => ({
        id: m.id,
        chatId: m.chatId,
        text: m.text,
        createdAt: m.createdAt,
        sender: {
          id: m.sender.id,
          email: m.sender.email,
          firstName: m.sender.firstName,
          lastName: m.sender.lastName,
          photo: m.sender.photo,
        },
        files: m.files.map((f) => ({
          id: f.id,
          url: f.url,
          mimeType: f.mimeType,
          fileName: f.fileName,
          size: f.size,
          createdAt: f.createdAt,
        })),
      }))

    return {
      data,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  public async assertChatMember(userId: string, chatId: string) {
    const member = await this.prisma.chatMember.findUnique({
      where: { chatId_userId: { chatId, userId } },
    })
    if (!member) throw new NotFoundException('Чат не найден')
    return member
  }

  public async createMessage(userId: string, chatId: string, text?: string) {
    await this.assertChatMember(userId, chatId)

    const message = await this.prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        text: text?.trim() ? text.trim() : null,
      },
      include: {
        sender: true,
        files: true,
      },
    })

    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    })

    return {
      id: message.id,
      chatId: message.chatId,
      text: message.text,
      createdAt: message.createdAt,
      sender: {
        id: message.sender.id,
        email: message.sender.email,
        firstName: message.sender.firstName,
        lastName: message.sender.lastName,
        photo: message.sender.photo,
      },
      files: [],
    }
  }
}

