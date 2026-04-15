import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { filterEmptyValues, getStatusOk } from '../common/helpers'
import { type Request } from 'express'
import { PaginatedResponse } from '../common/types'
import { MediaCommentCreateDto, MediaCommentUpdateDto, MediaListQueryDto, MediaPostCreateDto, MediaPostSort, MediaPostUpdateDto } from './dto'
import { getUserResponse } from '../user/dto'

@Injectable()
export class MediaService {
  public constructor(private readonly prisma: PrismaService) {}

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

    const descendants = rootIds.length
      ? await this.prisma.mediaComment.findMany({
          where: {
            postId,
            deletedAt: null,
            OR: [{ id: { in: rootIds } }, { parentId: { in: rootIds } }],
          },
          orderBy: { createdAt: 'asc' },
          include: {
            author: true,
            likes: userId ? { where: { userId } } : false,
          },
        })
      : []

    const byParent = new Map<string, any[]>()
    const roots = new Map<string, any>()

    for (const comment of descendants as any[]) {
      const node = {
        id: comment.id,
        text: comment.text,
        createdAt: comment.createdAt,
        likesCount: comment.likesCount,
        author: getUserResponse(comment.author),
        parentId: comment.parentId,
        isLiked: userId ? comment.likes.length > 0 : false,
        replies: [] as any[],
      }

      if (!node.parentId) {
        roots.set(node.id, node)
        continue
      }

      const arr = byParent.get(node.parentId) ?? []
      arr.push(node)
      byParent.set(node.parentId, arr)
    }

    const attachReplies = (node: any) => {
      const children = byParent.get(node.id) ?? []
      node.replies = children
      for (const child of children) attachReplies(child)
    }

    const data = rootComments
      .map((comment) => roots.get(comment.id))
      .filter(Boolean)

    for (const root of data) attachReplies(root)

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

  public async createPost(req: Request, dto: MediaPostCreateDto) {
    const authorId = req.session.userId

    await this.prisma.mediaPost.create({
      data: {
        title: dto.title ?? null,
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

    if (dto.parentId) {
      const parentComment = await this.prisma.mediaComment.findUnique({ where: { id: dto.parentId } })
      if (!parentComment || parentComment.deletedAt) throw new NotFoundException('Родительский комментарий не найден')
      if (parentComment.postId !== postId) throw new BadRequestException('Родительский комментарий принадлежит другому посту')
    }

    await this.prisma.mediaComment.create({
      data: {
        postId,
        userId: req.session.userId!,
        text: dto.text,
        parentId: dto.parentId,
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

  public async updatePost(id: string, dto: MediaPostUpdateDto) {
    if (!id || Array.isArray(id)) throw new BadRequestException('Invalid ID')

    const post = await this.prisma.mediaPost.findUnique({ where: { id } })
    if (!post || post.deletedAt) throw new NotFoundException('Пост не найден')

    const data = filterEmptyValues(dto)

    await this.prisma.mediaPost.update({
      where: { id },
      data,
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

