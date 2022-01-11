import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Observable } from 'rxjs'
import { DeleteResult, UpdateResult } from 'typeorm'
import { User } from './interfaces/user.interface'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: User): Observable<User> {
    return this.userService.createUser(user)
  }

  @Get()
  getAll(): Observable<User[]> {
    return this.userService.getAllUsers()
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() user: User,
  ): Observable<UpdateResult> {
    return this.userService.updateUser(id, user)
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.userService.deleteUser(id)
  }
}
