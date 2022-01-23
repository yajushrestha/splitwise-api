import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import * as bcrypt from "bcrypt"
import { from, map, NotFoundError, Observable, switchMap } from "rxjs"
import sendEmail from "src/utils/send-mail"
import { Repository } from "typeorm"
import { UserEntity } from "../users/entities/user.entity"
import { User } from "../users/interfaces/user.interface"

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12))
  }

  registerAccount(user: User): Observable<User> {
    const { name, username, password } = user

    return this.hashPassword(password).pipe(
      switchMap((hashedPassword: string) => {
        return from(
          this.userRepository.save({
            name,
            username,
            password: hashedPassword,
          }),
        ).pipe(
          map((user: User) => {
            delete user.password
            return user
          }),
        )
      }),
    )
  }

  validateUser(username: string, password: string): Observable<User> {
    return from(
      this.userRepository.findOne(
        { username },
        { select: ["id", "name", "username", "password"] },
      ),
    ).pipe(
      switchMap((user: User) =>
        from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) {
              delete user.password
              return user
            }
          }),
        ),
      ),
    )
  }

  login(user: User): Observable<string> {
    const { username, password } = user
    return this.validateUser(username, password).pipe(
      switchMap((user: User) => {
        if (user) {
          // create JWT - credentials
          console.log("zz", user)
          return from(this.jwtService.signAsync({ user }))
        }
      }),
    )
  }
  async forgotPassword(email: string, origin: string): Promise<string> {
    try {
      const user = await this.userRepository.findOneOrFail({ username: email })
      if (user) {
        const resetToken = generateToken()
        this.userRepository.save({
          id: user.id,
          reset_token: resetToken,
        })
        const link = `${origin}/reset-password?token=${resetToken}`
        sendEmail(user.username, "Password Reset Requested", link, user.name)
      }
      function generateToken(): string {
        return (
          new Date().getTime().toString(16) +
          (Math.random().toString(16) + "000000000000000000").substr(2, 16)
        )
      }
    } catch (error) {
      console.log(error)
    }
    return "Password reset link sent to your email if the user exists"
  }

  async resetPassword(
    id: number,
    password: string,
    token: string,
  ): Promise<string> {
    try {
      const pwd = await bcrypt.hash(password, 12)
      const user = await this.userRepository.findOneOrFail({
        reset_token: token,
      })
      if (user) {
        user.password = pwd
        this.userRepository.save(user)
        return "Password changed successfully."
      }
    } catch (error) {
      console.log(error)
    }
  }
}
