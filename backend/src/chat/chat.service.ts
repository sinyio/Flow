import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@/src/prisma/prisma.service'
import { S3Service } from '@/src/s3/s3.service'
import { SUPPORT_USER_ID } from './chat.constants'

@Injectable()
export class ChatService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
    private readonly config: ConfigService,
  ) {}

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
          response: true,
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

    const unreadCounts = await Promise.all(
      items.map((chat) => {
        const myMember = chat.members.find((m) => m.userId === userId)
        return this.prisma.message.count({
          where: {
            chatId: chat.id,
            senderId: { not: userId },
            ...(myMember?.lastReadAt ? { createdAt: { gt: myMember.lastReadAt } } : {}),
          },
        })
      }),
    )

    const data = items.map((chat, i) => {
      const otherMember = chat.members.find((m) => m.userId !== userId)
      const isSupportChat = chat.adId === null
      const canAssignCourier = Boolean(
        chat.ad &&
          chat.response &&
          chat.ad.authorId === userId &&
          otherMember &&
          otherMember.userId === chat.response.courierId &&
          !chat.ad.courierId &&
          chat.response.status !== 'SELECTED' &&
          chat.response.status !== 'ACCEPTED',
      )
      const isCourierConfirmed = Boolean(chat.ad?.courierId && chat.ad.courierId === userId)

      return {
        id: chat.id,
        adId: chat.adId,
        responseId: chat.responseId,
        isSupportChat,
        canAssignCourier,
        isCourierConfirmed,
        unreadCount: unreadCounts[i],
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        ad: chat.ad
          ? {
              id: chat.ad.id,
              title: chat.ad.title,
              status: chat.ad.status,
              image: chat.ad.image,
            }
          : {
              id: 'support',
              title: 'Поддержка',
              status: 'SUPPORT',
              image: null,
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

    await this.prisma.chatMember.update({
      where: { chatId_userId: { chatId, userId } },
      data: { lastReadAt: new Date() },
    })

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
        type: m.type,
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

  public async openSupportChat(userId: string | undefined) {
    if (!userId) throw new UnauthorizedException('Сессия не найдена')
    if (userId === SUPPORT_USER_ID) {
      throw new BadRequestException('Нельзя открыть этот чат от имени поддержки')
    }

    const supportUser = await this.prisma.user.findUnique({
      where: { id: SUPPORT_USER_ID },
    })
    if (!supportUser) throw new NotFoundException('Служба поддержки недоступна')

    const existing = await this.prisma.chat.findFirst({
      where: {
        adId: null,
        responseId: null,
        AND: [{ members: { some: { userId } } }, { members: { some: { userId: SUPPORT_USER_ID } } }],
      },
    })
    if (existing) return { chatId: existing.id }

    const chat = await this.prisma.chat.create({
      data: {
        adId: null,
        members: {
          create: [{ userId, role: 'CUSTOMER' }, { userId: SUPPORT_USER_ID }],
        },
      },
    })

    return { chatId: chat.id }
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
      type: message.type,
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

  public async getChatFile(userId: string | undefined, chatId: string, fileId: string) {
    if (!userId) throw new UnauthorizedException('Сессия не найдена')
    await this.assertChatMember(userId, chatId)

    const file = await this.prisma.messageFile.findFirst({
      where: { id: fileId, message: { chatId } },
    })
    if (!file) throw new NotFoundException('Файл не найден')

    const bucket = this.config.getOrThrow('MINIO_BUCKET')
    const prefix = `${this.config.getOrThrow('MINIO_PUBLIC_BASE')}/${bucket}/`
    const key = file.url.startsWith(prefix) ? file.url.slice(prefix.length) : file.url

    const downloaded = await this.s3.download(bucket, key)

    return {
      body: downloaded.body,
      mimeType: file.mimeType || downloaded.contentType,
      fileName: file.fileName,
      size: file.size ?? downloaded.body.length,
    }
  }
}

