import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { from, Observable } from "rxjs"
import { DeleteResult, Repository, UpdateResult } from "typeorm"
import { UserEntity } from "./entities/user.entity"
import { User } from "./interfaces/user.interface"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  createUser(user: User): Observable<User> {
    return from(this.userRepository.save(user))
  }

  getAllUsers(): Observable<User[]> {
    return from(this.userRepository.find())
  }

  updateUser(id: number, user: User): Observable<UpdateResult> {
    return from(this.userRepository.update(id, user))
  }

  deleteUser(id: number): Observable<DeleteResult> {
    return from(this.userRepository.delete(id))
  }
}
