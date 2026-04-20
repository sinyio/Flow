import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { filterEmptyValues, getStatusOk } from '../common/helpers'
import { type Request } from 'express'
import { PaginatedResponse } from '../common/types'
import { MediaCommentCreateDto, MediaCommentUpdateDto, MediaListQueryDto, MediaPostCreateDto, MediaPostFilter, MediaPostSort, MediaPostUpdateDto } from './dto'
import { getUserResponse } from '../user/dto'
import { nanoid } from 'nanoid'
import sharp from 'sharp'
import { S3Service } from '../s3/s3.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MediaService {
  public constructor(private readonly prisma: PrismaService,
    private readonly s3: S3Service,
    private readonly configService: ConfigService
  ) { }

  public findPostById(id: string) {
    return this.prisma.mediaPost.findUnique({
      where: { id },
    })
  }

  public findCommentById(id: string) {
    return this.prisma.mediaComment.findUnique({
      where: { id },
    })
  }

  public async getPostById(req: Request, id: string) {
    const userId = req.session.userId

    const post = await this.prisma.mediaPost.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        author: true,
        likes: userId ? { where: { userId } } : false,
        favorites: userId ? { where: { userId } } : false,
        _count: {
          select: {
            comments: {
              where: { deletedAt: null },
            },
          },
        },
      },
    })

    if (!post) throw new NotFoundException('Пост не найден')

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: getUserResponse(post.author),
      viewsCount: post.viewsCount,
      likesCount: post.likesCount,
      favoritesCount: post.favoritesCount,
      commentsCount: post._count.comments,
      isLiked: userId ? post.likes.length > 0 : false,
      isFavorite: userId ? post.favorites.length > 0 : false,
    }
  }

  public async getPosts(req: Request, query: MediaListQueryDto): Promise<PaginatedResponse<any>> {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const userId = req.session.userId

    const FLOW_AUTHOR_ID = 'adminuser'

    let authorFilter: Prisma.MediaPostWhereInput['author'] = undefined
    if (query.filter === MediaPostFilter.FLOW) {
      authorFilter = { id: FLOW_AUTHOR_ID }
    } else if (query.filter === MediaPostFilter.USERS) {
      authorFilter = { id: { not: FLOW_AUTHOR_ID } }
    }

    const where: Prisma.MediaPostWhereInput = {
      deletedAt: null,
      ...(query.authorId ? { authorId: query.authorId } : {}),
      ...(query.search
        ? {
          title: {
            contains: query.search,
            mode: 'insensitive',
          },
        }
        : {}),
      ...(authorFilter ? { author: authorFilter } : {}),
    }

    const orderBy: Prisma.MediaPostOrderByWithRelationInput =
      query.sort === MediaPostSort.OLDEST
        ? { createdAt: 'asc' }
        : query.sort === MediaPostSort.RELEVANT
          ? { viewsCount: 'desc' }
          : { createdAt: 'desc' }

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.mediaPost.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: true,
          likes: userId ? { where: { userId } } : false,
          favorites: userId ? { where: { userId } } : false,
          _count: {
            select: {
              comments: {
                where: { deletedAt: null },
              },
            },
          },
        },
      }),
      this.prisma.mediaPost.count({ where }),
    ])

    const data = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      author: getUserResponse(post.author),
      viewsCount: post.viewsCount,
      likesCount: post.likesCount,
      favoritesCount: post.favoritesCount,
      commentsCount: post._count.comments,
      isLiked: userId ? post.likes.length > 0 : false,
      isFavorite: userId ? post.favorites.length > 0 : false,
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

  public async getPostComments(req: Request, postId: string, query: MediaListQueryDto): Promise<PaginatedResponse<any>> {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const userId = req.session.userId

    const post = await this.prisma.mediaPost.findUnique({ where: { id: postId } })
    if (!post || post.deletedAt) throw new NotFoundException('Пост не найден')

    const [rootComments, total] = await this.prisma.$transaction([
      this.prisma.mediaComment.findMany({
        where: {
          postId,
          deletedAt: null,
          parentId: null,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: true,
          likes: userId ? { where: { userId } } : false,
        },
      }),
      this.prisma.mediaComment.count({
        where: {
          postId,
          deletedAt: null,
          parentId: null,
        },
      }),
    ])

    const rootIds = rootComments.map((comment) => comment.id)

    const replies = rootIds.length
      ? await this.prisma.mediaComment.findMany({
        where: {
          postId,
          deletedAt: null,
          parentId: { in: rootIds },
        },
        orderBy: { createdAt: 'asc' },
        include: {
          author: true,
          parent: {
            include: {
              author: true,
            },
          },
          likes: userId ? { where: { userId } } : false,
        },
      })
      : []

    const byParent = new Map<string, any[]>()

    for (const comment of replies as any[]) {
      if (!comment.parentId) continue

      const replyNode = {
        id: comment.id,
        text: comment.text,
        createdAt: comment.createdAt,
        likesCount: comment.likesCount,
        author: getUserResponse(comment.author),
        parentId: comment.parentId,
        isLiked: userId ? comment.likes.length > 0 : false,
        replyTo: comment.parent ? getUserResponse(comment.parent.author) : null,
      }

      const arr = byParent.get(comment.parentId) ?? []
      arr.push(replyNode)
      byParent.set(comment.parentId, arr)
    }

    const data = rootComments.map((comment: any) => ({
      id: comment.id,
      text: comment.text,
      createdAt: comment.createdAt,
      likesCount: comment.likesCount,
      author: getUserResponse(comment.author),
      parentId: null,
      isLiked: userId ? comment.likes.length > 0 : false,
      replyTo: null,
      replies: byParent.get(comment.id) ?? [],
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

  public async createPost(req: Request, dto: MediaPostCreateDto, file) {
    const authorId = req.session.userId

    const postId = nanoid(12)

    let imageKey: string | undefined
    if (file) {
      const originalBuffer = file.buffer
      imageKey = `posts/${postId}/image`

      const thumb600 = await sharp(originalBuffer)
        .resize(1920, 700, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toBuffer()

      await this.s3.upload(
        this.configService.getOrThrow('MINIO_BUCKET'),
        imageKey,
        thumb600,
        'image/jpeg'
      )
    }

    const image = `${this.configService.getOrThrow('MINIO_PUBLIC_BASE')}/${this.configService.getOrThrow('MINIO_BUCKET')}/${imageKey ? imageKey : 'posts/default/post_image.jpg'}`

    await this.prisma.mediaPost.create({
      data: {
        id: postId,
        title: dto.title ?? null,
        content: dto.content ?? null,
        image: image,
        authorId: authorId!,
      },
    })

    return getStatusOk()
  }

  public async addView(postId: string) {
    const post = await this.prisma.mediaPost.findUnique({ where: { id: postId } })
    if (!post || post.deletedAt) throw new NotFoundException('Пост не найден')

    await this.prisma.mediaPost.update({
      where: { id: postId },
      data: { viewsCount: { increment: 1 } },
    })

    return getStatusOk()
  }

  public async togglePostLike(req: Request, postId: string) {
    const userId = req.session.userId
    const post = await this.prisma.mediaPost.findUnique({ where: { id: postId } })
    if (!post || post.deletedAt) throw new NotFoundException('Пост не найден')

    const existingLike = await this.prisma.mediaPostLike.findUnique({
      where: { postId_userId: { postId, userId: userId! } },
    })

    if (existingLike) {
      await this.prisma.$transaction([
        this.prisma.mediaPostLike.delete({ where: { id: existingLike.id } }),
        this.prisma.mediaPost.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        }),
      ])

      return getStatusOk({ liked: false })
    }

    await this.prisma.$transaction([
      this.prisma.mediaPostLike.create({
        data: {
          postId,
          userId: userId!,
        },
      }),
      this.prisma.mediaPost.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      }),
    ])

    return getStatusOk({ liked: true })
  }

  public async togglePostFavorite(req: Request, postId: string) {
    const userId = req.session.userId
    const post = await this.prisma.mediaPost.findUnique({ where: { id: postId } })
    if (!post || post.deletedAt) throw new NotFoundException('Пост не найден')

    const existingFavorite = await this.prisma.mediaPostFavorite.findUnique({
      where: { postId_userId: { postId, userId: userId! } },
    })

    if (existingFavorite) {
      await this.prisma.$transaction([
        this.prisma.mediaPostFavorite.delete({ where: { id: existingFavorite.id } }),
        this.prisma.mediaPost.update({
          where: { id: postId },
          data: { favoritesCount: { decrement: 1 } },
        }),
      ])

      return getStatusOk({ favorite: false })
    }

    await this.prisma.$transaction([
      this.prisma.mediaPostFavorite.create({
        data: {
          postId,
          userId: userId!,
        },
      }),
      this.prisma.mediaPost.update({
        where: { id: postId },
        data: { favoritesCount: { increment: 1 } },
      }),
    ])

    return getStatusOk({ favorite: true })
  }

  public async createComment(req: Request, postId: string, dto: MediaCommentCreateDto) {
    const post = await this.prisma.mediaPost.findUnique({ where: { id: postId } })
    if (!post || post.deletedAt) throw new NotFoundException('Пост не найден')

    let parentId: string | null = null

    if (dto.parentId) {
      const parentComment = await this.prisma.mediaComment.findUnique({ where: { id: dto.parentId } })
      if (!parentComment || parentComment.deletedAt) throw new NotFoundException('Родительский комментарий не найден')
      if (parentComment.postId !== postId) throw new BadRequestException('Родительский комментарий принадлежит другому посту')
      parentId = parentComment.parentId ?? parentComment.id
    }

    await this.prisma.mediaComment.create({
      data: {
        postId,
        userId: req.session.userId!,
        text: dto.text,
        parentId,
      },
    })

    return getStatusOk()
  }

  public async toggleCommentLike(req: Request, commentId: string) {
    const userId = req.session.userId
    const comment = await this.prisma.mediaComment.findUnique({ where: { id: commentId } })
    if (!comment || comment.deletedAt) throw new NotFoundException('Комментарий не найден')

    const existingLike = await this.prisma.mediaCommentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: userId!,
        },
      },
    })

    if (existingLike) {
      await this.prisma.$transaction([
        this.prisma.mediaCommentLike.delete({ where: { id: existingLike.id } }),
        this.prisma.mediaComment.update({
          where: { id: commentId },
          data: { likesCount: { decrement: 1 } },
        }),
      ])

      return getStatusOk({ liked: false })
    }

    await this.prisma.$transaction([
      this.prisma.mediaCommentLike.create({
        data: {
          commentId,
          userId: userId!,
        },
      }),
      this.prisma.mediaComment.update({
        where: { id: commentId },
        data: { likesCount: { increment: 1 } },
      }),
    ])

    return getStatusOk({ liked: true })
  }

  public async updatePost(id: string, dto: MediaPostUpdateDto, file) {
    if (!id || Array.isArray(id)) throw new BadRequestException('Invalid ID')

    const post = await this.prisma.mediaPost.findUnique({ where: { id } })
    if (!post || post.deletedAt) throw new NotFoundException('Пост не найден')

    const data = filterEmptyValues(dto)

    let imageKey: string | undefined
    if (file) {
      const postId = id
      const originalBuffer = file.buffer
      imageKey = `posts/${postId}/image`

      const thumb600 = await sharp(originalBuffer)
        .resize(1920, 700, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toBuffer()

      await this.s3.upload(
        this.configService.getOrThrow('MINIO_BUCKET'),
        imageKey,
        thumb600,
        'image/jpeg'
      )
    }

    const imagePath = `${this.configService.getOrThrow('MINIO_PUBLIC_BASE')}/${this.configService.getOrThrow('MINIO_BUCKET')}/${imageKey}`

    await this.prisma.mediaPost.update({
      where: { id },
      data: {
        ...data,
        ...(imagePath && { image: imagePath }),
      },
    })

    return getStatusOk()
  }

  public async deletePost(id: string) {
    if (!id || Array.isArray(id)) throw new BadRequestException('Invalid ID')

    const post = await this.prisma.mediaPost.findUnique({ where: { id } })
    if (!post || post.deletedAt) throw new NotFoundException('Пост не найден')

    await this.prisma.mediaPost.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        title: null,
        viewsCount: 0,
        likesCount: 0,
        favoritesCount: 0,
      },
    })

    return getStatusOk()
  }

  public async updateComment(id: string, dto: MediaCommentUpdateDto) {
    if (!id || Array.isArray(id)) throw new BadRequestException('Invalid ID')

    const comment = await this.prisma.mediaComment.findUnique({ where: { id } })
    if (!comment || comment.deletedAt) throw new NotFoundException('Комментарий не найден')

    const data = filterEmptyValues(dto)

    await this.prisma.mediaComment.update({
      where: { id },
      data,
    })

    return getStatusOk()
  }

  public async deleteComment(id: string) {
    if (!id || Array.isArray(id)) throw new BadRequestException('Invalid ID')

    const comment = await this.prisma.mediaComment.findUnique({ where: { id } })
    if (!comment || comment.deletedAt) throw new NotFoundException('Комментарий не найден')

    await this.prisma.mediaComment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        text: null,
        likesCount: 0,
      },
    })

    return getStatusOk()
  }
}

