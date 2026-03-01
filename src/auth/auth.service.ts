import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async login(email: string, password: string) {
    console.log(email, password);
    const user = await this.prisma.user.findFirst({
      where: { email: 'operaciones+406@dey.mx' },
    });
    const data = {}
    try {
      if (!user) throw new Error('Invalid credentials');
      const resp = await this.prisma.verified_user.findFirst({
        where: { email },
      });
      if (resp)
        user['curp'] = resp.curp;

      return {
        user,
      };
    } catch (er) {
      throw new Error('Invalid credentials');
    }
  }

  async getOnboardingResult(email: string): Promise<any> {
    try {
      const res = await this.prisma.verified_user.findFirst({
        where: { email },
      });
      const havePass = res && res.password && res.password.length > 0;
      const getVerify = await this.prisma.temp_codes.findFirst({
        where: {
          email: email,
          type: 'default',
          is_verify: 1,
        },
        orderBy: { id: 'desc' },
      });
      const mailVerify = getVerify ? true : false;

      const identityVerify = await this.prisma.data_validation_result.findFirst({
        where: {
          email_user: email,
          process_id: {
            contains: 'success',
          },
        },
      });
      const identityVerified = identityVerify ? true : false;

      const sign = await this.prisma.signing_result.findFirst({
        where: {
          email: email,
          event_type: 'doc_signed',
        },
      });

      const signStarted = await this.prisma.signing_result.findFirst({
        where: {
          email: email,
          event_type: 'doc_start',
        },
      });

      const userData = await this.prisma.user.findFirst({
        where: { email },
      });
      console.log('userData', userData);
      const signed = sign ? true : false;
      return {
        havePass,
        mailVerify,
        identityVerified,
        signed,
        signedStarted: signStarted ? true : false,
        acceptCredit: userData?.sod_id ? true : false,
      };
    } catch (err) {
      throw new Error('Error in: AuthService');
    }
  }
  /*create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }*/
}
