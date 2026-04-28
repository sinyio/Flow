import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { UserRole } from '@prisma/client'

@Injectable()
export class AdminGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    if (request.user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Доступ только для администраторов')
    }

    return true
  }
}
