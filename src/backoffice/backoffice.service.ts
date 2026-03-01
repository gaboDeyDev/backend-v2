/*eslint-disable @typescript-eslint/no-unsafe-assignment*/
/*eslint-disable @typescript-eslint/no-unsafe-member-access*/
/*eslint-disable @typescript-eslint/no-unsafe-call*/

import { Injectable } from '@nestjs/common';
import { CreateBackofficeDto } from './dto/create-backoffice.dto';
import { UpdateBackofficeDto } from './dto/update-backoffice.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BackofficeService {
  private readonly prismaService: PrismaService;
  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  create(createBackofficeDto: CreateBackofficeDto) {
    console.log(createBackofficeDto);
    return 'This action adds a new backoffice';
  }

  async createUsers(
    createBackofficeDto: Prisma.userCreateInput,
    createVerifiedUserDto: Prisma.verified_userCreateInput,
  ) {
    try {
      console.log('1', { createBackofficeDto });
      console.log('2', { createVerifiedUserDto });

      // Validation rules for verified_user fields
      const errors: string[] = [];
      const v = createVerifiedUserDto;
      if (!v.names || v.names.length > 255)
        errors.push('names must be <= 255 characters');
      if (!v.lastname || v.lastname.length > 255)
        errors.push('lastname must be <= 255 characters');
      if (!v.birth_date) errors.push('birth_date is required');
      if (!v.gender) errors.push('gender is required');
      if (!v.birth_state || v.birth_state.length > 255)
        errors.push('birth_state must be <= 255 characters');
      if (v.nationality && v.nationality.length > 255)
        errors.push('nationality must be <= 255 characters');
      if (!v.curp || v.curp.length !== 18)
        errors.push('curp must be exactly 18 characters');
      if (!v.rfc || v.rfc.length > 13)
        errors.push('rfc must be <= 13 characters');
      if (!v.email || v.email.length > 255)
        errors.push('email must be <= 255 characters');
      if (!v.phone) errors.push('phone is required');
      if (!v.residence_country || v.residence_country.length > 255)
        errors.push('residence_country must be <= 255 characters');
      if (!v.residence_state || v.residence_state.length > 255)
        errors.push('residence_state must be <= 255 characters');
      if (v.neighborhood && v.neighborhood.length > 255)
        errors.push('neighborhood must be <= 255 characters');
      if (v.postalCode && v.postalCode.toString().length > 255)
        errors.push('postalCode must be <= 255 characters');
      if (v.identitynumber && v.identitynumber.toString().length > 50)
        errors.push('identitynumber must be <= 50 characters');
      if (v.identitytype && v.identitytype.length > 50)
        errors.push('identitytype must be <= 50 characters');
      if (v.legal_street_name && v.legal_street_name.length > 255)
        errors.push('legal_street_name must be <= 255 characters');
      if (v.legal_street_number && v.legal_street_number.toString().length > 20)
        errors.push('legal_street_number must be <= 20 characters');
      if (v.legal_floor && v.legal_floor.length > 10)
        errors.push('legal_floor must be <= 10 characters');
      if (v.legal_apartment && v.legal_apartment.toString().length > 10)
        errors.push('legal_apartment must be <= 10 characters');
      if (v.legal_zip_code && v.legal_zip_code.toString().length > 10)
        errors.push('legal_zip_code must be <= 10 characters');
      if (v.legal_neighborhood && v.legal_neighborhood.length > 100)
        errors.push('legal_neighborhood must be <= 100 characters');
      if (v.legal_city && v.legal_city.length > 100)
        errors.push('legal_city must be <= 100 characters');
      if (v.legal_region && v.legal_region.length > 100)
        errors.push('legal_region must be <= 100 characters');
      if (v.legal_municipality && v.legal_municipality.length > 100)
        errors.push('legal_municipality must be <= 100 characters');

      // Uniqueness checks for curp, rfc, email, phone, identitynumber
      const uniqueErrors: string[] = [];
      const uniqueChecks = [
        { field: 'curp', value: v.curp, label: 'el curp ya existe' },
        { field: 'rfc', value: v.rfc, label: 'el rfc ya existe' },
        { field: 'email', value: v.email, label: 'el correo ya existe' },
        {
          field: 'phone',
          value: v.phone?.toString(),
          label: 'el telefono ya existe',
        },
        {
          field: 'identitynumber',
          value: v.identitynumber?.toString(),
          label: 'el número de identidad ya existe',
        },
      ];

      // Check in verified_user table
      for (const check of uniqueChecks) {
        if (check.value) {
          const exists = await this.prismaService.verified_user.findFirst({
            where: { [check.field]: check.value },
          });
          if (exists) uniqueErrors.push(check.label);
        }
      }

      // Check in user table for email, phone
      const userChecks = [
        { field: 'email', value: v.email, label: 'el correo ya existe' },
        {
          field: 'phone',
          value: v.phone?.toString(),
          label: 'el telefono ya existe',
        },
      ];
      for (const check of userChecks) {
        if (check.value) {
          const exists = await this.prismaService.user.findFirst({
            where: { [check.field]: check.value },
          });
          if (exists && !uniqueErrors.includes(check.label))
            uniqueErrors.push(check.label);
        }
      }

      if (errors.length > 0 || uniqueErrors.length > 0) {
        return {
          error: 'Validation failed for verified_user fields.',
          errors: [...errors, ...uniqueErrors],
          errorDescription:
            `${errors.join(',')} ${errors.length > 0 ? ',' : ''} ${uniqueErrors.join(',')}`.trim(),
        };
      }

      await this.prismaService.verified_user.create({
        data: {
          ...createVerifiedUserDto,
          birth_date: new Date(createVerifiedUserDto.birth_date),
          phone: createVerifiedUserDto.phone.toString(),
          neighborhood: createVerifiedUserDto.neighborhood,
          postalCode: createVerifiedUserDto?.postalCode?.toString(),
          identitynumber: createVerifiedUserDto?.identitynumber?.toString(),
          identitytype: createVerifiedUserDto.identitytype,
          legal_street_name: createVerifiedUserDto.legal_street_name,
          legal_street_number:
            createVerifiedUserDto?.legal_street_number?.toString(),
          legal_floor: createVerifiedUserDto.legal_floor,
          legal_apartment: createVerifiedUserDto?.legal_apartment?.toString(),
          legal_zip_code: createVerifiedUserDto?.legal_zip_code?.toString(),
          legal_neighborhood: createVerifiedUserDto.legal_neighborhood,
          legal_city: createVerifiedUserDto.legal_city,
          legal_region: createVerifiedUserDto.legal_region,
          legal_municipality: createVerifiedUserDto.legal_municipality,
          legal_additional_info: createVerifiedUserDto.legal_additional_info,
          mothers_lastname: createVerifiedUserDto.mothers_lastname,
          fathers_lastname: createVerifiedUserDto.fathers_lastname,
          is_new: true,
        },
      });

      await this.prismaService.user.create({
        data: {
          ...createBackofficeDto,
          name: createVerifiedUserDto.names,
          cognito_id: uuidv4(),
          phone: createBackofficeDto.phone
            ? createBackofficeDto.phone.toString()
            : null,
          salary: createBackofficeDto.salary,
        },
      });
      return 'This action adds a new user';
    } catch (error: any) {
      let messageError = error?.message ?? 'Unknown error';
      if (messageError.includes('failed on the fields: (`email`)')) {
        messageError = 'Este correo ya está registrado.';
      }
      console.error('Error creating user and verified_user:', error);
      return {
        error: 'An error occurred while creating the user.',
        errorDescription: messageError ?? 'Unknown error',
        errors: [],
      };
    }
  }

  async loginBO(email: string, password: string) {
    const user = await this.prismaService.admin.findFirst({
      where: { email },
    });
    if (!user) {
      return { error: 'Usuario no encontrado' };
    }
    const passwordMatch = await bcrypt.compare(password, user.password || '');
    if (!passwordMatch) {
      return { error: 'Contraseña incorrecta' };
    }
    return { message: 'Login exitoso', user };
  }

  findAll() {
    return `This action returns all backoffice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} backoffice`;
  }

  update(id: number, updateBackofficeDto: UpdateBackofficeDto) {
    console.log(updateBackofficeDto);
    return `This action updates a #${id} backoffice`;
  }

  remove(id: number) {
    return `This action removes a #${id} backoffice`;
  }

  async getListUsers(limit = 10, page = 1, search?: string, status?: string) {
    console.log({ limit, page, search, status });
    const where: Prisma.verified_userWhereInput = {
      is_new: true,
    };
    if (search) {
      where.OR = [
        { names: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // if (status) {
    //   where.status = status;
    // }

    const [data, total] = await Promise.all([
      this.prismaService.verified_user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prismaService.verified_user.count({ where }),
    ]);

    const dataReturn = await Promise.all(
      data.map(async (user) => {
        const havePass = user && user.password && user.password.length > 0;
        const getVerify = await this.prismaService.temp_codes.findFirst({
          where: {
            email: user.email,
            type: 'default',
            is_verify: 1,
          },
          orderBy: { id: 'desc' },
        });
        const mailVerify = getVerify ? true : false;

        const identityVerify =
          await this.prismaService.data_validation_result.findFirst({
            where: {
              email_user: user.email,
              process_id: {
                contains: 'success',
              },
            },
          });
        const identityVerified = identityVerify ? true : false;

        const sign = await this.prismaService.signing_result.findFirst({
          where: {
            email: user.email,
            event_type: 'doc_signed',
          },
        });

        // const signStarted = await this.prismaService.signing_result.findFirst({
        //   where: {
        //     email: user.email,
        //     event_type: 'doc_start',
        //   },
        // });

        const userData = await this.prismaService.user.findFirst({
          where: { email: user.email },
        });
        console.log('userData', userData);
        const signed = sign ? true : false;
        // 'Formulario' |
        //   'Validacion correo' |
        //   'Buro de credito' |
        //   'Salario' |
        //   'Validacion de identidad' |
        //   'Firma de contrato';
        const acceptCredit = userData?.sod_id ? true : false;
        let status = 'Creado';
        if (
          signed &&
          identityVerified &&
          acceptCredit &&
          mailVerify &&
          havePass
        ) {
          status = 'Activo';
        } else if (identityVerified && acceptCredit && mailVerify && havePass) {
          status = 'Firma de contrato';
        } else if (acceptCredit && mailVerify && havePass) {
          status = 'Validacion de identidad';
        } else if (mailVerify && havePass) {
          status = 'Propuesta';
        } else if (havePass) {
          status = 'Validacion correo';
        }
        return {
          ...user,
          status: status,
        };
      }),
    );
    return {
      data: dataReturn,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCountStatusUsers() {
    // if (status) {
    //   where.status = status;
    // }

    const data = await this.prismaService.verified_user.findMany({
      where: { is_new: true },
    });

    let activeCount = 0;
    let contractSigningCount = 0;
    let identityVerificationCount = 0;
    let proposalCount = 0;
    let emailValidationCount = 0;
    let formCount = 0;

    await Promise.all(
      data.map(async (user) => {
        const havePass = user && user.password && user.password.length > 0;
        const getVerify = await this.prismaService.temp_codes.findFirst({
          where: {
            email: user.email,
            type: 'default',
            is_verify: 1,
          },
          orderBy: { id: 'desc' },
        });
        const mailVerify = getVerify ? true : false;

        const identityVerify =
          await this.prismaService.data_validation_result.findFirst({
            where: {
              email_user: user.email,
              process_id: {
                contains: 'success',
              },
            },
          });
        const identityVerified = identityVerify ? true : false;

        const sign = await this.prismaService.signing_result.findFirst({
          where: {
            email: user.email,
            event_type: 'doc_signed',
          },
        });

        const userData = await this.prismaService.user.findFirst({
          where: { email: user.email },
        });
        console.log('userData', userData);
        const signed = sign ? true : false;

        const acceptCredit = userData?.sod_id ? true : false;
        if (
          signed &&
          identityVerified &&
          acceptCredit &&
          mailVerify &&
          havePass
        ) {
          activeCount++;
        } else if (identityVerified && acceptCredit && mailVerify && havePass) {
          contractSigningCount++;
        } else if (acceptCredit && mailVerify && havePass) {
          identityVerificationCount++;
        } else if (mailVerify && havePass) {
          proposalCount++;
        } else if (havePass) {
          emailValidationCount++;
        } else {
          formCount++;
        }
        return {
          activeCount,
          contractSigningCount,
          identityVerificationCount,
          proposalCount,
          emailValidationCount,
          formCount,
          total: data.length,
        };
      }),
    );
    return {
      data: {
        activeCount,
        contractSigningCount,
        identityVerificationCount,
        proposalCount,
        emailValidationCount,
        formCount,
        total: data.length,
      },
    };
  }
}
