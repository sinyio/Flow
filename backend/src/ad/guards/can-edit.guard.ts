import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AdService } from "../ad.service";

@Injectable()
export class CanEditAd implements CanActivate {
    public constructor(private readonly adService: AdService) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const ad = await this.adService.findAdById(request, request.params.id)
        if (ad.author.id !== request.session.userId) {
            throw new ForbiddenException('У вас нет доступа к этому объявлению')
        }

        return true
    }
}