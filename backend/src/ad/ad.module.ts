import { Module } from '@nestjs/common';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { UserService } from '../user/user.service';
import { S3Service } from '../s3/s3.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Module({
  controllers: [AdController],
  providers: [AdService, UserService, S3Service, AuthGuard],
})
export class AdModule {}
