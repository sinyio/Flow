import { Module } from '@nestjs/common'

import { AuthGuard } from '../auth/guards/auth.guard'
import { UserService } from '../user/user.service'
import { S3Service } from '../s3/s3.service'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { AdminGuard } from './guards/admin.guard'

@Module({
  controllers: [AdminController],
  providers: [AdminService, AdminGuard, AuthGuard, UserService, S3Service],
})
export class AdminModule {}
