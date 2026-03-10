import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'

export function getCorsConfig(configService): CorsOptions {
  return {
    origin: configService.getOrThrow('HTTP_CORS').split(','),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  }
}
