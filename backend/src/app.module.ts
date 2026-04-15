import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { MailModule } from './mail/mail.module'
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module'
import { AdModule } from './ad/ad.module';
import { S3Module } from './s3/s3.module';
import { ChatModule } from './chat/chat.module'
import { ReviewModule } from './review/review.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    MailModule,
    EmailConfirmationModule,
    AdModule,
    S3Module,
    ChatModule,
    ReviewModule,
    MediaModule,
  ],
})
export class AppModule {}
