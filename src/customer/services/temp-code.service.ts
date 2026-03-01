import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DateFormater } from 'src/utils/dateFormater/dateFormater';

@Injectable()
export class TempCodeService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async saveTempCode(email: string, code: string, type?: string): Promise<any> {
    try {
      // Obtener el último id
      const lastEntry = await this.prisma.temp_codes.findFirst({
        orderBy: { id: 'desc' },
      });
      const nextId = lastEntry ? lastEntry.id + 1 : 1;
      const existingEntry = await this.prisma.temp_codes.create({
        data: {
          id: nextId,
          email: email,
          code: code,
          type: type ?? 'default', // Replace 'default' with the appropriate type value
          expiration: new Date(Date.now() + 30 * 60 * 1000), // expires in 30 minutes
          is_verify: 0,
        },
      });
      return existingEntry;
    } catch (err) {
      throw new BadRequestException('Error saving temp code', err);
    }
  }
    async saveTempCodeRecover(email: string, code: string, type?: string): Promise<any> {
    try {
      // Obtener el último id
      const lastEntry = await this.prisma.temp_codes.findFirst({
        orderBy: { id: 'desc' },
      });
      const nextId = lastEntry ? lastEntry.id + 1 : 1;
      const existingEntry = await this.prisma.temp_codes.create({
        data: {
          id: nextId,
          email: email,
          code: code,
          type: type ?? 'default', // Replace 'default' with the appropriate type value
            expiration: new Date(Date.now() + 10 * 60 * 1000), // expires in 10 minutes
          is_verify: 0,
        },
      });
      return existingEntry;
    } catch (err) {
      throw new BadRequestException('Error saving temp code', err);
    }
  }

  async verifyTempCode(email: string, code: string): Promise<boolean> {
    try {
      const entry = await this.prisma.temp_codes.findFirst({
        where: {
          email: email,
          expiration: {
            gt: new Date(), // Ensure the code is not expired
          },
        },
        orderBy: { id: 'desc' },
      });
      console.log('Verifying code:', code, 'for email:', email);
      console.log('Found entry:', entry);
      if (!entry || entry.code !== code) {
        return false;
      }
      console.log('entry', entry);
      if (entry) {
        await this.prisma.temp_codes.update({
          where: { id: entry.id },
          data: { is_verify: 1 },
        });
      }
      return entry !== null;
    } catch (err) {
      throw new BadRequestException('Error verifying temp code', err);
    }
  }

  async verifyTempCodeWhatsapp(email: string, code: string): Promise<boolean> {
    try {
      const entry = await this.prisma.temp_codes.findFirst({
        where: {
          email: email,
          code: code,
          type: 'whatsapp',
          // expiration: {
          //   gt: new Date(), // Ensure the code is not expired
          // },
        },
      });
      console.log('entry', entry);
      return entry !== null;
    } catch (err) {
      throw new BadRequestException('Error verifying temp code', err);
    }
  }
}
