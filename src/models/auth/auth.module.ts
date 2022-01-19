import { Module } from "@nestjs/common"
import { UserController } from "../users/user.controller"
import { UserService } from "../users/user.service"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "../users/entities/user.entity"
import { JwtModule } from "@nestjs/jwt"
import { JwtGuard } from "./guards/jwt.guard"
import { JwtStrategy } from "./guards/jwt.strategy"

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "3600s" },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, UserService, JwtGuard, JwtStrategy],
  exports: [AuthService, UserService, JwtModule],
  controllers: [AuthController, UserController],
})
export class AuthModule {}
