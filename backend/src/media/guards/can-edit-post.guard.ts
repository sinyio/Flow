import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { MediaService } from '../media.service'

@Injectable()
export class CanEditMediaPost implements CanActivate {
  public constructor(private readonly mediaService: MediaService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const post = await this.mediaService.findPostById(request.params.id)

    if (!post) throw new NotFoundException('Пост не найден')

    if (post.authorId !== request.session.userId) {
      throw new ForbiddenException('У вас нет доступа к этому посту')
    }

    return true
  }
}

