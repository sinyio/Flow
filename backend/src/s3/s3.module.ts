import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { AdService } from '../ad/ad.service';

@Module({
  providers: [AdService, S3Service],
  exports: [S3Service],
})
export class S3Module {}
