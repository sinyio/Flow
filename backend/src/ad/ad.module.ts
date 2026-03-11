import { Module } from '@nestjs/common';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [AdController],
  providers: [AdService, UserService],
})
export class AdModule {}
