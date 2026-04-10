import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from '@/src/prisma/prisma.service'
import { S3Service } from '@/src/s3/s3.service'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'node:crypto'

type ChatAttachmentInput = {
  name?: string
  mimeType?: string
  dataBase64: string
  size?: number
}

@Injectable()
export class ChatService {
  private static readonly MAX_ATTACHMENTS_COUNT = 10
  private static readonly MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024

  public constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
    private readonly config: ConfigService,
  ) {}

  private mapFile(chatId: string, file: { id: string; mimeType: string; fileName: string | null; size: number | null; createdAt: Date }) {
    return {
      id: file.id,
      url: `/chats/${chatId}/files/${file.id}`,
      mimeType: file.mimeType,
      fileName: file.fileName,
      size: file.size,
      createdAt: file.createdAt,
    }
  }

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
          ...this.mapFile(chatId, f),
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

  public async createMessage(
    userId: string,
    chatId: string,
    text?: string,
    attachments: ChatAttachmentInput[] = [],
  ) {
    await this.assertChatMember(userId, chatId)

    if (attachments.length > ChatService.MAX_ATTACHMENTS_COUNT) {
      throw new BadRequestException('Слишком много вложений')
    }

    const normalizedText = text?.trim() ? text.trim() : null
    if (!normalizedText && attachments.length === 0) {
      throw new BadRequestException('Сообщение не может быть пустым')
    }

    const messageId = randomUUID()
    const filesToCreate: Array<{
      messageId: string
      url: string
      mimeType: string
      fileName: string | null
      size: number
    }> = []

    for (const attachment of attachments) {
      const mimeType = attachment.mimeType?.trim() || 'application/octet-stream'
      const fileName = attachment.name?.trim() || null
      const body = Buffer.from(attachment.dataBase64, 'base64')

      if (body.length === 0) {
        throw new BadRequestException('Вложение повреждено или пустое')
      }

      if (body.length > ChatService.MAX_ATTACHMENT_SIZE) {
        throw new BadRequestException('Размер вложения превышает 10MB')
      }

      const fileId = randomUUID()
      const key = `chat/${chatId}/${messageId}/${fileId}`

      await this.s3.upload(
        this.config.getOrThrow('MINIO_BUCKET'),
        key,
        body,
        mimeType,
      )

      filesToCreate.push({
        messageId,
        url: key,
        mimeType,
        fileName,
        size: body.length,
      })
    }

    const message = await this.prisma.message.create({
      data: {
        id: messageId,
        chatId,
        senderId: userId,
        text: normalizedText,
        files: filesToCreate.length
          ? {
              createMany: {
                data: filesToCreate,
              },
            }
          : undefined,
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
      files: message.files.map((f) => this.mapFile(message.chatId, f)),
    }
  }

  public async getChatFile(userId: string | undefined, chatId: string, fileId: string) {
    if (!userId) throw new UnauthorizedException('Сессия не найдена')

    await this.assertChatMember(userId, chatId)

    const file = await this.prisma.messageFile.findFirst({
      where: {
        id: fileId,
        message: {
          chatId,
        },
      },
      select: {
        id: true,
        url: true,
        mimeType: true,
        fileName: true,
        size: true,
      },
    })

    if (!file) {
      throw new NotFoundException('Файл не найден')
    }

    const downloaded = await this.s3.download(this.config.getOrThrow('MINIO_BUCKET'), file.url)

    return {
      ...downloaded,
      fileName: file.fileName,
      mimeType: file.mimeType || downloaded.contentType,
      size: file.size ?? downloaded.contentLength ?? downloaded.body.length,
    }
  }
}

