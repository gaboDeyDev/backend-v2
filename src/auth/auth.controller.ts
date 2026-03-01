import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, UseInterceptors, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from './dto/auth.dto';
import { TokenCreatorInterceptor } from 'src/middleware/token_creator.interceptor';
// import { LoginService } from 'src/account/login.service';
//import { AuthenticationGuard } from 'src/middleware/guard/authentication.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  //@UseGuards(AuthenticationGuard)
  async refresh() {

    return {
      accessToken: '12345678',
      idToken: '123',
      refreshToken: '12345678' // El refresh token no siempre se devuelve
    };

  }

  @Post('sign-in')
  @UseInterceptors(TokenCreatorInterceptor)
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() { email, password }: Login) {
    return {
      success: true
    }
  }

  @Post('validatePassForTransactions')
  @HttpCode(HttpStatus.OK)
  //@UseGuards(AuthenticationGuard)
  async cvalidatePassForTransactions(
    @Body() { email, password }: Login,
  ) {
    return await this.authService.login(email, password)
  }

  @Get('onboarding-result/:email')
  @HttpCode(HttpStatus.OK)
  //@UseGuards(AuthenticationGuard)
  async onboardingResult(
    @Param('email') email: string,
  ): Promise<any> {
    return await this.authService.getOnboardingResult(email);
  }
}
