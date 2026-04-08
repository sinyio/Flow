import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserService } from '../user/user.service'
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import { MailService } from '../mail/mail.service'
import { S3Service } from '../s3/s3.service'

@Module({
  imports: [
    forwardRef(() => EmailConfirmationModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, MailService, S3Service],
  exports: [AuthService],
})
export class AuthModule {}
