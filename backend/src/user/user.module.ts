import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { S3Service } from '../s3/s3.service'
import { AuthService } from '../auth/auth.service'
import { EmailConfirmationService } from '../auth/email-confirmation/email-confirmation.service'
import { MailService } from '../mail/mail.service'

@Module({
  controllers: [UserController],
  providers: [
    UserService, 
    S3Service, 
    AuthService, 
    EmailConfirmationService, 
    MailService
  ],
  exports: [UserService],
})
export class UserModule {}
