import { Module } from '@nestjs/common';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { UserService } from '../user/user.service';
import { S3Service } from '../s3/s3.service';

@Module({
  controllers: [AdController],
  providers: [AdService, UserService, S3Service],
})
export class AdModule {}
