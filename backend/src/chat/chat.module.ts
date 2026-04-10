import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { ChatGateway } from './chat.gateway'
import { UserModule } from '@/src/user/user.module'
import { S3Module } from '@/src/s3/s3.module'

@Module({
  imports: [UserModule, S3Module],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}

