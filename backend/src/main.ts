import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getCorsConfig } from './config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AuthModule } from './auth/auth.module'
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module'

import cookieParser from 'cookie-parser'
import session from 'express-session'
import { RedisStore } from 'connect-redis'
import { createClient, type RedisClientType } from 'redis'
import { ms, parseBoolean } from './utils'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)
  const logger = new Logger()

  const redisClient: RedisClientType = createClient({
    socket: {
      host: config.getOrThrow('REDIS_HOST'),
      port: config.getOrThrow('REDIS_PORT'),
    },
    username: config.getOrThrow('REDIS_USER'),
    password: config.getOrThrow('REDIS_PASSWORD'),
  })

  redisClient.on('error', (err) => {
    logger.error('Redis Client Error', err)
  })

  await redisClient.connect()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  )

  app.use(cookieParser(config.getOrThrow('COOKIES_SECRET')))
  app.use(
    session({
      secret: config.getOrThrow('SESSION_SECRET'),
      name: config.getOrThrow('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redisClient,
        prefix: config.getOrThrow('SESSION_FOLDER'),
      }),
    }),
  )

  app.enableCors(getCorsConfig(config))

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Flow API')
    .build()

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [AuthModule, EmailConfirmationModule],
  })
  SwaggerModule.setup('docs', app, swaggerDocument)

  const port = config.getOrThrow('HTTP_PORT')
  const host = config.getOrThrow('HTTP_HOST')

  try {
    await app.listen(port)
    logger.log(`--- Server is running on ${host} ---`)
    logger.log(`--- Swagger: ${host}/docs ---`)
  } catch (error) {
    logger.error('--- Failed to start server ---', error)
    process.exit(1)
  }
}

bootstrap()
