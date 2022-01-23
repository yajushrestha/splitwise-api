import { Body, Controller, Headers, Post } from "@nestjs/common"
import { map, Observable } from "rxjs"
import { User } from "../users/interfaces/user.interface"
import { AuthService } from "./auth.service"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("register")
  register(@Body() user: User): Observable<User> {
    return this.authService.registerAccount(user)
  }

  @Post("login")
  login(@Body() user: User): Observable<{ token: string }> {
    return this.authService
      .login(user)
      .pipe(map((jwt: string) => ({ token: jwt })))
  }
  @Post("forgot-password")
  async forgotPassword(@Body('email') email: string, @Headers('x-forwarded-host') origin: string): Promise<{ message: string }> {
    const message = await this.authService.forgotPassword(email, origin)
    return { message }
  }

  @Post("reset-password")
  async resetPassword(@Body('password') password: string, @Body('token') token: string): Promise<{ message: string }> {
    const message =  await this.authService.resetPassword(password, token);
    return { message }
  }
}
