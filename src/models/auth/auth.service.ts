import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import * as bcrypt from "bcrypt"
import { from, map, Observable, switchMap } from "rxjs"
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
          return from(this.jwtService.signAsync({ user }))
        }
      }),
    )
  }
}
