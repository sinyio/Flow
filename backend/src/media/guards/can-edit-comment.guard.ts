import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { MediaService } from '../media.service'

@Injectable()
export class CanEditMediaComment implements CanActivate {
  public constructor(private readonly mediaService: MediaService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const comment = await this.mediaService.findCommentById(request.params.id)

    if (!comment) throw new NotFoundException('Комментарий не найден')

    if (comment.userId !== request.session.userId) {
      throw new ForbiddenException('У вас нет доступа к этому комментарию')
    }

    return true
  }
}

