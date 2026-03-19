import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { UserModule } from '@/src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
