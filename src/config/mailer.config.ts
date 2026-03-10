import { ConfigService } from '@nestjs/config'
import { MailerOptions } from '@nestjs-modules/mailer'

export const getMailerConfig = async (configService: ConfigService): Promise<MailerOptions> => ({
  transport: {
    host: configService.getOrThrow('MAIL_HOST'),
    port: configService.getOrThrow('MAIL_PORT'),
    secure: configService.getOrThrow('MAIL_SECURE'),
    auth: {
      user: configService.getOrThrow('MAIL_LOGIN'),
      pass: configService.getOrThrow('MAIL_PASSWORD'),
    },
  },
  defaults: {
    from: configService.getOrThrow('MAIL_LOGIN'),
  },
})
