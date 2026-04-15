import { Module } from '@nestjs/common'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'
import { UserModule } from '../user/user.module'

@Module({
  imports: [UserModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}

