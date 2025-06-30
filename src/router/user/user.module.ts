import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtWrapperModule } from '@/components/jwt/jwt.module';
import { MongodbModule } from '@/components/sql/mongodb/mongodb.module';

@Module({
  imports: [JwtWrapperModule, MongodbModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
