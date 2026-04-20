import { Module } from '@nestjs/common'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'
import { UserModule } from '../user/user.module'
import { S3Service } from '../s3/s3.service'

@Module({
  imports: [UserModule],
  controllers: [MediaController],
  providers: [MediaService, S3Service],
})
export class MediaModule {}

