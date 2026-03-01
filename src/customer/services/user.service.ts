import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DateFormater } from 'src/utils/dateFormater/dateFormater';

@Injectable()
export class UserService {
  private formatDate: DateFormater;
  constructor(private prisma: PrismaService) {
    this.formatDate = new DateFormater();
  }

  async getUserId(email: string): Promise<any> {
    try {
      // const res = await this.fetchHttp.fetchGetExternalService(
      //   `${process.env.AUTH_URL}/user/findByEmail/${email}`,
      // );
      // return res.data.data.id;
      const res = await this.prisma.verified_user.findFirst({
        where: { email: email },
      });
      return res ? res.id : 0;
    } catch (err) {
      throw new BadRequestException('Error in: UserService', err);
    }
  }

  async getUser(email: string): Promise<any> {
    try {
      try {
        // const res = await this.fetchHttp.fetchGetExternalService(
        //   `${process.env.AUTH_URL}/user/findByEmail/${email}`,
        // );
        // return res.data.data.id;
        const res = await this.prisma.verified_user.findFirst({
          where: { email: email },
        });
        return res;
      } catch (err) {
        throw new BadRequestException('Error in: UserService', err);
      }
      return 1;
    } catch (err) {
      console.log('Error fetching user:', err);
      throw new BadRequestException('Error in: UserService', err);
    }
  }

  async validateSession(email: string): Promise<any> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: email },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return user.physical_card_id;
    } catch (err) {
      throw new BadRequestException('Error validating session', err);
    }
  }

  async updateCurrentId(email: string, currentId: string): Promise<any> {
    try {

      const user = await this.prisma.user.findFirst({
        where: { email: email },
      });
      console.log('User found for updateCurrentId:', user);

      const verifiedUser = await this.prisma.verified_user.findFirst({
        where: { email: email },
      });

      if (!user || !verifiedUser) {
        throw new BadRequestException('User not found');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { physical_card_id: '1' },
      });
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: { cognito_id: currentId },
      });
      return updatedUser;
    } catch (err) {
      throw new BadRequestException('Error updating current ID', err);
    }
  }

  getUserSalary(email: string): any {
    const currentDay = this.formatDate.getNumberCurrentDate();
    const currentMonthDays = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      0,
    ).getDate();
    try {
      // const res = await this.fetchHttp.fetchGetExternalService(
      //   `${process.env.AUTH_URL}/user/findByEmail/${email}`,
      // );
      const userData = {
        currentDay: 0,
        salary: '1000',
        salary_type: 'monthly',
        monthSalary: 0,
        balance: '0.00',
      };
      let monthSalary: number;

      switch (userData.salary_type) {
        case 'monthly':
          monthSalary = parseFloat(userData.salary);
          break;
        case 'weekly':
          monthSalary = parseFloat(userData.salary) * 4;
          break;
        case 'biweekly':
          monthSalary = parseFloat(userData.salary) * 2;
          break;
        default:
          throw new BadRequestException('Unknown salary type');
      }

      const userBalance = (monthSalary / currentMonthDays) * currentDay;
      userData.monthSalary = monthSalary;
      userData.balance = userBalance.toFixed(2);
      userData.currentDay = currentDay;
      return userData;
    } catch (err) {
      throw new BadRequestException('Error in: UserService', err);
    }
  }

  async getUserSalaryAndCat(email: string): Promise<any> {
    try {
      console.log('email', email);
      // Buscar el verified_user por email
      const verifiedUser = await this.prisma.verified_user.findFirst({
        where: { email },
      });
      console.log('verifiedUser', verifiedUser);
      if (!verifiedUser) {
        throw new BadRequestException('Verified user not found');
      }

      // Buscar el user por email
      const user = await this.prisma.user.findFirst({
        where: { email },
      });

      console.log('user', user);
      return {
        verifiedUser,
        user,
        cat: 32,
      };
    } catch (err) {
      throw new BadRequestException('Error in: UserService', err);
    }
  }

  async updatePassword(email: string, newPassword: string): Promise<any> {
    try {
      const user = await this.prisma.verified_user.findFirst({
        where: { email: email },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      const updatedUser = await this.prisma.verified_user.update({
        where: { id: user.id },
        data: { password: newPassword },
      });
      return updatedUser;
    } catch (err) {
      throw new BadRequestException('Error updating password', err);
    }
  }

  async updateLoin(email: string, status: string): Promise<any> {
    const userExist = await this.prisma.user.findFirst({
      where: { email: email },
    });

    if (!userExist) {
      throw new BadRequestException('User not found');
    }
    await this.prisma.user.update({
      where: { id: userExist.id },
      data: { physical_card_id: status },
    });
  }
}
