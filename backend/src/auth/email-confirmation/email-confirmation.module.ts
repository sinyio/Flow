import { forwardRef, Module } from '@nestjs/common'
import { EmailConfirmationService } from './email-confirmation.service'
import { EmailConfirmationController } from './email-confirmation.controller'
import { MailModule } from '@/src/mail/mail.module'
import { AuthModule } from '../auth.module'
import { UserService } from '@/src/user/user.service'
import { MailService } from '@/src/mail/mail.service'
import { S3Service } from '@/src/s3/s3.service'

@Module({
  imports: [MailModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService, UserService, MailService, S3Service],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
