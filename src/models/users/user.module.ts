import { Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "./entities/user.entity"
import { AuthService } from "../auth/auth.service"
import { AuthController } from "../auth/auth.controller"
import { JwtService } from "@nestjs/jwt"

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, AuthService, JwtService],
  controllers: [UserController, AuthController],
})
export class UserModule {}
