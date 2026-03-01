import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { UpdateUserPreferencesDto } from './dtos/preferences.dto';
import type { Response } from 'express';
import { TruoraService } from './services/truora.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly truoraService: TruoraService,
  ) {}

  @Post('register')
  async registerCustomerController(@Body() body: any) {
    return await this.customerService.registerForm(body);
  }

  @Get('kyc-status/:email/:acceptTcandPrivacity/:acceptPubiclty')
  @UseGuards(JwtAuthGuard)
  async getKYCStatus(
    @Param('email') email: string,
    @Param('acceptTcandPrivacity') acceptTcandPrivacity: boolean,
    @Param('acceptPubiclty') acceptPubiclty: boolean,
  ) {
    console.log('pong', email, acceptTcandPrivacity, acceptPubiclty);
    return await this.customerService.verifyKycStatus(
      email,
      acceptTcandPrivacity,
      acceptPubiclty,
    );
  }

  @Get('verify-email-register/:email')
  async checkIfExist(@Param('email') email: string) {
    return await this.customerService.checkIfExist(email);
  }

  @Post('sign-up')
  async signUp(@Body() body: any) {
    const result = await this.customerService.signUp(body);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Body() body: any) {
    const result = await this.customerService.logout(body.email);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Post('send-otp')
  async sendOtp(@Body() body: any) {
    console.log('Sending OTP to', body);
    const result = await this.customerService.sendMailOTP(body);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Post('send-otp-recover')
  async sendOtpRecover(@Body() body: any) {
    console.log('Sending OTP to', body);
    const result = await this.customerService.sendMailOTPRecover(body);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Patch(':id/preferences')
  @UseGuards(JwtAuthGuard)
  async updatePreferences(
    @Query() preferences: UpdateUserPreferencesDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.customerService.updatePreferences(id, preferences);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: any) {
    console.log('Verifying OTP for', body);
    const res = await this.customerService.verifyOtp(body.email, body.otp);
    return { data: res };
  }

  @Post('verify-otp-pass')
  async verifyOtpPass(@Body() body: any) {
    console.log('Verifying OTP for', body);
    const res = await this.customerService.verifyOtpPass(
      body.email,
      body.otp,
      body.pass,
    );
    return { data: res };
  }

  @Post('otp-whatsapp')
  async otpWhatsapp(@Body() body: any) {
    const result = await this.customerService.sendWhatsapp(body);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Post('verify-otp-whatsapp')
  async verifyOtpWhatsapp(@Body() body: any) {
    console.log('Verifying OTP for', body);
    const res = await this.customerService.verifyOtpWhatsapp(
      body.email,
      body.otp,
    );
    return { data: res };
  }

  @Get('getUserSalay/:email')
  @UseGuards(JwtAuthGuard)
  async getUserSalay(@Param('email') email: string) {
    const res = await this.customerService.getUserSalaryAndCat(email);
    return { data: res };
  }

  @Post('score-verification')
  @UseGuards(JwtAuthGuard)
  async scoreVerification(@Res() response: Response, @Body() body: any) {
    const data = await this.customerService.scoreVerification(body.email);
    return response.status(200).json({ data });
  }

  @Post('employment-verifications')
  @UseGuards(JwtAuthGuard)
  async employmentVerifications(@Body() body: any) {
    console.log('Verifying employment for', body);
    return { data: true };
  }

  @Post('acept-proposal')
  @UseGuards(JwtAuthGuard)
  async createCustomerPomelo(@Res() response: Response, @Body() body: any) {
    const res = await this.customerService.pomeloCustomerCreation(body.email);
    return response.status(200).json({ data: res });
  }

  @Get('commission')
  async getCommission(@Res() response: Response) {
    console.log('Getting commission');
    const data = {
      id: 1,
      card_usage: '10',
      bank_transference: '15',
      cashier_withdrawal: '9',
      marketplace_usage: '4',
      CAT: '30',
      rate: '10',
      date_created: '2024-02-08T23:32:10.837Z',
    };
    return response.status(200).json({ data });
  }

  @Post('login')
  async login(@Body() body: any) {
    console.log('Logging in', body);
    const result = await this.customerService.login(body);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Post('refreshToken')
  async refreshToken(@Body() body: any) {
    console.log('Refreshing token for', body);
    const result = await this.customerService.refreshToken(body.email);
    return {
      statusCode: 200,
      data: result,
    };
  }


  @Get('validationLink/:email')
  async generateValidationLink(@Param('email') email: string) {
    try {
      const data = await this.truoraService.generateValidationLink(email);
      return data;
    } catch (error) {
      console.error('Error generating validation link:', error);
      throw error;
    }
  }

  @Post('createDocument')
  async createDocument(@Body() { email, is_publicity }: any) {
    const response = await this.truoraService.createDocument(
      email,
      is_publicity,
    );

    return response;
  }

  @Get('contract-info/:email')
  async getContractInfo(@Param('email') email: string) {
    const data = await this.truoraService.getContractInfo(email);
    return data;
  }

  @Post('sw-sapien')
  async sendJsonToSw(@Body() body: any) {
    const result = await this.truoraService.sendJsonToSw(body);
    return result;
  }

  @Post('check-session')
  @UseGuards(JwtAuthGuard)
  async checkSession(@Body() body: any) {
    console.log('Checking session for', body);
    const result = await this.customerService.checkSession(body.email);
    return {
      statusCode: 200,
      data: result,
    };
  }

  // no se usa en sindicatos
  // @Post('credit-assignment')
  // async creditAssignment(
  //   @Res() response: Response,
  //   @Body() body: any) {
  //   console.log('Credit assignment for', body);
  //   const userSalary = 25000;
  //   const data = {
  //     CircleCreditData: '{"folioConsulta"...',
  //     birthDate: '1999-08-09',
  //   }
  //   const res: any = await this.customerService.creditAssignment({ ...body, ...data, salary: userSalary, userSalary: { monthSalary: 25000 } });
  //   return response.status(200).json({ data: res });
  // }
}
