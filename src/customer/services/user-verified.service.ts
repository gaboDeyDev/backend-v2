import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserVerifiedDto } from '../dtos/userVerify.dto';
import { KycserviceService } from './kycservice.service';
// import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { NotificationsService } from './notofocations-service';
// import { ApplicationConfigType } from 'src/config/types/application.type';
// import { VerifiedUser } from 'src/domain/entities/userVerified';
// import { CARD_STATUS_MO } from 'src/domain/enum/cardStatus.enum';
// import { modifyStatusDto } from 'src/infrastructure/dto/mo.dto';
// import { deleteUserValue } from 'src/infrastructure/dto/user.dto';
// import {
//   UpdateUserVerifiedCreditDto,
//   UpdateUserVerifiedDto,
//   UserVerifiedDto,
//   UserVerifiedFilterDto,
// } from 'src/infrastructure/dto/userVerify.dto';
// import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
// import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
// import { DataValidateResultUseCases } from 'src/usecases/dataValidationResult.usecases';
// import { RequestPhysicalCardUseCases } from 'src/usecases/RequestPhysicCard.usecases';
// import { UserUseCases } from 'src/usecases/user.usecases';
// import { UserVerifiedUseCases } from 'src/usecases/userVerified.usecase';
// import { ValidationResultUseCases } from 'src/usecases/validationResult.usecases';
// import { CreditService } from '../credit/credit.service';
// import { HandleservicesService } from '../handleservices/handleservices.service';
// import { KycserviceService } from '../kycservice/kycservice.service';
// import { MoService } from '../mo/mo.service';
// import { NotificationsService } from '../notifications/notifications.service';
// import { TransactionsService } from '../transactions/transactions.service';
// import { UserService } from '../user/user.service';

@Injectable()
export class UserVerifiedService {
  private readonly emailForPhysicalCards: string;
  // private readonly userVerifyRepository: any;

  constructor(
    // @Inject(UsecasesProxyModule.USER_USECASES_PROXY)
    // private readonly userUsecasesProxy: UseCaseProxy<UserVerifiedUseCases>,
    // @Inject(UsecasesProxyModule.USER_RESULT_USECASES_PROXY)
    // private readonly userResultUsecasesProxy: UseCaseProxy<UserUseCases>,
    // @Inject(UsecasesProxyModule.DATA_VALIDATION_RESULT_USECASES_PROXY)
    // private readonly dataValidationResultUsecasesProxy: UseCaseProxy<DataValidateResultUseCases>,
    // @Inject(UsecasesProxyModule.VALIDATION_RESULT_USECASES_PROXY)
    // private readonly validationResultUsecasesProxy: UseCaseProxy<ValidationResultUseCases>,
    // private readonly kycService: KycserviceService,
    private readonly notificationsService: NotificationsService,
    // private readonly handle: HandleservicesService,
    // private readonly creditService: CreditService,
    // private readonly userService: UserService,
    // private readonly transactionsService: TransactionsService,
    // private readonly moService: MoService,
    // @Inject(UsecasesProxyModule.REQUESTER_PHYSIC_CARDS_USECASES_PROXY)
    // private readonly requestPhysicalCardUseCasesProxy: UseCaseProxy<RequestPhysicalCardUseCases>,
    // private readonly config: ConfigService,
    private prisma: PrismaService,
    private readonly kycService: KycserviceService,
  ) {
    // this.emailForPhysicalCards =
    //   this.config.get<ApplicationConfigType>('application').emailPhysicalCards;
    // this.userVerifyRepository = {
    //   findVerifiedUser: async (emailAddress: string, rfc: string, curp: string) => {
    //     // Implement the actual logic or inject the real repository
    //     return await this.prisma.verified_user.findFirst({
    //       where: {
    //         email: emailAddress,
    //         rfc: rfc,
    //         curp: curp,
    //       },
    //     });
    //   },
    // };
  }

  async createUserAndVerify(body: UserVerifiedDto) {
    try {
      console.log('Creating user and verifying:', body);
      const payload = this.kycService.buildPayloadFromUser(body);
      console.log('Payload for KYC service:', payload);
      const response = await lastValueFrom(
        this.kycService.searchInLists(payload),
      );
      console.log('Response from KYC service:', response.data);
      this.notificationsService.enviarCorreoSegunRespuesta(
        response.data.err,
        body.emailAddress,
        body.names,
      );
      console.log('Sending email notification completed');
      body.kycData = JSON.stringify(response.data);
      console.log('KYC data updated in body:', body.kycData);
      console.log('Inserting user into UserUseCases', body);
      return await this.prisma.verified_user.create({
        data: {
          names: body.names,
          lastname: String(body.lastname),
          // birth_place: String(body.birthPlace),
          nationality: body.nationality,
          birth_date: new Date(body.birthDate).toISOString(),
          gender: body.gender,
          address: body.address,
          residence_state: body.residenceState,
          residence_country: body.residenceCountry,
          curp: body.curp,
          rfc: body.rfc,
          email: body.emailAddress,
          // phone_number: body.phoneNumber,
          neighborhood: body.neighborhood,
          // postal_code: body.postalCode,
          kyc_data: body.kycData,
          // data_agreement: body.dataAgreement,
          // terms_agreement: body.termsAgreement,
          // identity_number: body.identityNumber,
          // identity_type: body.identityType,
          legal_street_name: body.legal_street_name,
          legal_street_number: String(body.legal_street_number),
          legal_zip_code: body.legal_zip_code,
          legal_neighborhood: body.legal_neighborhood,
          legal_city: body.legal_city,
          legal_region: body.legal_region,
          legal_municipality: body.legal_municipality,
          legal_additional_info: body.legal_additional_info,
          fathers_lastname: body.fathersLastname,
          mothers_lastname: body.mothersLastname,
          legal_floor: String(body.legal_floor),
          legal_apartment: body.legal_apartment,
          birth_state: body.birthPlace ?? '', // Add birth_state, fallback to empty string if not present
          phone: body.phoneNumber ?? '', // Add phone, fallback to empty string if not present
        },
      });
    } catch (error) {
      console.error('Error in createUserAndVerify:', error);
      throw new BadRequestException('Error al crear y verificar el usuario');
    }
  }

  // async userCreditType(
  //   userEmail: string,
  // ): Promise<{ isAble: boolean; creditType: string }> {
  //   try {
  //     const userId = await this.userService.getUserId(userEmail);

  //     const res = await this.creditService.getCreditByUserId(userId);

  //     if (!res.product_type) {
  //       return {
  //         isAble: false,
  //         creditType: 'No credit type assigned',
  //       };
  //     }

  //     const creditType =
  //       res.product_type.toUpperCase() === 'ONDEMAND'
  //         ? 'ON_DEMAND'
  //         : 'MICROCREDIT';

  //     return { isAble: true, creditType: creditType };
  //   } catch (error) {
  //     this.handle.handleError('Error in userCreditType', error);
  //   }
  // }

  async updateUserIfNeeded(body: UserVerifiedDto, existingUser: any) {
    if (
      !this.kycService.hasPassedVerificationThreshold(
        existingUser.kycDataLastChecked,
      )
    ) {
      throw new Error('El usuario ya ha sido verificado recientemente.');
    }
    const payload = this.kycService.buildPayloadFromUser(body);
    console.log('Payload for KYC service:', payload);
    const response = await lastValueFrom(
      this.kycService.searchInLists(payload),
    );
    existingUser.kycData = JSON.stringify(response.data);
    existingUser.kycDataLastChecked = new Date().toISOString();
    this.notificationsService.enviarCorreoSegunRespuesta(
      response.data.err,
      body.emailAddress,
      body.names,
    );
    return await this.prisma.verified_user.update({
      where: { id: existingUser.id },
      data: existingUser,
    });
  }

  async findUserByEmail(email: string): Promise<any> {
    console.log('Finding user by email:', email);
    try {
      const user = await this.prisma.verified_user.findFirst({
        where: {
          email: email,
        },
      });

      if (!user) {
        return {
          kyc_data: '',
        };
      }

      return user;
    } catch (err) {
      console.error('Error in findUserByEmail:', err);
    }
  }

  async checkIfExistAccount(email: string): Promise<any> {
    console.log('Finding user by email:', email);
    try {
      const user = await this.prisma.verified_user.findFirst({
        where: {
          email: email,
          password: {
            not: null,
          },
        },
      });

      return user;
    } catch (err) {
      console.error('Error in findUserByEmail:', err);
    }
  }

  // async findUserByEmailAndNull(email: string): Promise<VerifiedUser> {
  async findUserByEmailAndNull(email: string): Promise<any> {
    try {
      const user = this.prisma.verified_user.findFirst({
        where: {
          email: email,
        },
      });

      if (!user) {
        return null;
      }

      return user;
    } catch (err) {
      console.error('Error in findUserByEmailAndNull:', err);
      throw err;
    }
  }

  async findVerifiedUser(
    data: Omit<UserVerifiedDto, 'dataAgreement' | 'termsAgreement'>,
  ): Promise<any> {
    try {
      return await this.prisma.verified_user.findFirst({
        where: {
          email: data.emailAddress,
          rfc: data.rfc,
          curp: data.curp,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async updateUserPreferences(
    email: string,
    acceptTcandPrivacity: string,
    acceptMarketing: string,
  ): Promise<any> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          accepts_tc_provacity: acceptTcandPrivacity === 'true' ? true : false,
          accepts_publicity: acceptMarketing === 'true' ? true : false,
        },
      });
      return updatedUser;
    } catch (err) {
      throw new BadRequestException('Error updating user preferences', err);
    }
  }
  // async update(data: UpdateUserVerifiedDto) {
  //   const findUser = await this.userUsecasesProxy
  //     .getInstance()
  //     .findByEmail(data.email);

  //   const body: VerifiedUser = {
  //     ...findUser,
  //     names: data.names,
  //     lastname: data.lastname,
  //     birthDate: data.birthDate,
  //     gender: data.gender,
  //     birthState: data.birthState,
  //     nationality: data.nationality,
  //     curp: data.curp,
  //     rfc: data.rfc,
  //     phone: data.phone,
  //     residenceCountry: data.residenceCountry,
  //     residenceState: data.residenceState,
  //     address: data.address,
  //     credit: data.credit,
  //   };

  //   const res = await this.userUsecasesProxy.getInstance().update(body);
  //   return res;
  // }

  // async updateCredit(data: UpdateUserVerifiedCreditDto) {
  //   const findUser = await this.userUsecasesProxy
  //     .getInstance()
  //     .findByEmail(data.email);

  //   const body: VerifiedUser = {
  //     ...findUser,
  //     credit: data.credit,
  //   };

  //   const res = await this.userUsecasesProxy.getInstance().update(body);
  //   return res;
  // }

  // async listAllUsers(filter: UserVerifiedFilterDto) {
  //   const result = await this.userUsecasesProxy
  //     .getInstance()
  //     .listAllUsers(filter);

  //   return result;
  // }

  // async safeUpdate(body: UpdateUserVerifiedDto) {
  //   const response = await this.userUsecasesProxy
  //     .getInstance()
  //     .safeUpdate(body);

  //   return response;
  // }

  // async findByCURP(CURP: string) {
  //   const user = await this.userUsecasesProxy.getInstance().findByCURP(CURP);

  //   return user;
  // }

  // async findFullFilledByEmail(email: string) {
  //   const user: any = await this.userUsecasesProxy
  //     .getInstance()
  //     .findFullFilledByEmail(email);

  //   user.truoraValidations = null;

  //   await this.addingTruoraValidations(email, user);

  //   if (!user) {
  //     throw new NotFoundException();
  //   }
  //   return user;
  // }

  // async addingTruoraValidations(email: string, user: any) {
  //   const process = await this.dataValidationResultUsecasesProxy
  //     .getInstance()
  //     .findByEmail(email);

  //   if (process?.process_id) {
  //     const validationResults = await this.validationResultUsecasesProxy
  //       .getInstance()
  //       .findAllByProcessId(process.process_id);

  //     if (validationResults) {
  //       const truoraValidations: {
  //         validations: Record<string, { validationResponse: string }>;
  //         processId: string;
  //         dateCreated: Date;
  //       } = {
  //         validations: {},
  //         processId: '',
  //         dateCreated: undefined,
  //       };

  //       validationResults.forEach(event => {
  //         const eventData = JSON.parse(event.data);
  //         const eventType = eventData.event_type;
  //         const eventAction = event.event_action;
  //         truoraValidations.validations[eventType] = {
  //           validationResponse: eventAction,
  //         };
  //       });
  //       truoraValidations.processId = validationResults[0].process_id;
  //       truoraValidations.dateCreated = validationResults[0].date_created;

  //       user.truoraValidations = truoraValidations;
  //     }
  //   }
  // }

  // async deleteUser(id: number): Promise<{ deleted: boolean }> {
  //   try {
  //     const valid = await this.transactionsService.validDeleteUser(id);
  //     if (!valid) {
  //       throw new NotFoundException(`El usuario no puede ser eliminado`);
  //     }

  //     const getUser = await this.userResultUsecasesProxy
  //       .getInstance()
  //       .findById(id);

  //     if (!getUser) {
  //       throw new NotFoundException(`El usuario no existe`);
  //     }

  //     await this.moService.getCustomerBalance(getUser.id.toString()).then(
  //       async function (consultBalance) {
  //         if (consultBalance) {
  //           if (consultBalance.response_data) {
  //             if (parseFloat(consultBalance.response_data.total_debt) > 0) {
  //               throw new NotFoundException(
  //                 `El usuario no puede ser eliminado, tiene deuda pendiente`,
  //               );
  //             }
  //           }
  //         }
  //       },
  //       function (error) {},
  //     );

  //     const getUserVerified = await this.userUsecasesProxy
  //       .getInstance()
  //       .findByEmail(getUser.email);

  //     if (getUserVerified) {
  //       const bodyVerified = {
  //         id: getUserVerified.id,
  //         names: deleteUserValue.NAMES,
  //         lastname: deleteUserValue.NAMES,
  //         birthDate: '1900-01-01',
  //         gender: deleteUserValue.NAMES,
  //         birthState: getUserVerified.birthState,
  //         nationality: getUserVerified.nationality,
  //         curp: deleteUserValue.PHONE,
  //         rfc: deleteUserValue.PHONE,
  //         email: deleteUserValue.EMAIL + '_' + getUserVerified.id,
  //         phone: deleteUserValue.PHONE,
  //         residenceCountry: deleteUserValue.PHONE,
  //         residenceState: '000-000-0000',
  //         address: deleteUserValue.NAMES,
  //         kycData: '{}',
  //         CircleCreditData: '{}',
  //         EvaData: '{}',
  //         kycDataLastChecked: getUserVerified.kycDataLastChecked,
  //         circleCreditDataLastChecked:
  //           getUserVerified.circleCreditDataLastChecked,
  //         evaDataLastChecked: getUserVerified.evaDataLastChecked,
  //         date_created: getUserVerified.date_created,
  //         credit: '{}',
  //         neighborhood: deleteUserValue.PHONE,
  //         postalCode: deleteUserValue.PHONE,
  //         dataAgreement: false,
  //         termsAgreement: false,
  //       };

  //       const resultVerified = await this.userUsecasesProxy
  //         .getInstance()
  //         .update(bodyVerified);

  //       if (!resultVerified.rowCount) {
  //         throw new BadRequestException(`Error al eliminar el verified_user`);
  //       }
  //     }

  //     const body = {
  //       id: getUser.id,
  //       names: deleteUserValue.NAMES,
  //       email: deleteUserValue.EMAIL + '_' + getUser.id,
  //       phone: deleteUserValue.PHONE,
  //       salary: getUser.salary,
  //       salary_type: getUser.salary_type,
  //       insurance: getUser.insurance,
  //       cognito_id: getUser.cognito_id,
  //       email_verified: getUser.email_verified,
  //       phone_verified: getUser.phone_verified,
  //       date_created: getUser.date_created,
  //       is_active: false,
  //       date_created_delete: new Date(),
  //     };

  //     const result = await this.userResultUsecasesProxy
  //       .getInstance()
  //       .update(body);

  //     if (!result.rowCount) {
  //       throw new BadRequestException(`Error al eliminar el usuario`);
  //     }

  //     const listCards: string[] = [];
  //     await this.moService.getCustomerInformation(getUser.id.toString()).then(
  //       async function (consultCards) {
  //         if (consultCards) {
  //           if (consultCards.response_data.account_card.cards.length > 0) {
  //             for (
  //               let i = 0;
  //               i < consultCards.response_data.account_card.cards.length;
  //               i++
  //             ) {
  //               listCards.push(
  //                 consultCards.response_data.account_card.cards[i].external_id,
  //               );
  //             }
  //           }
  //         }
  //       },
  //       function (error) {},
  //     );

  //     if (listCards.length > 0) {
  //       for (let i = 0; i < listCards.length; i++) {
  //         const requestModifyCard: modifyStatusDto = new modifyStatusDto();
  //         requestModifyCard.card_external_id = listCards[i];
  //         requestModifyCard.card_status = CARD_STATUS_MO.CANCELED;

  //         await this.moService.modifyStatus(requestModifyCard);
  //       }
  //     }

  //     return { deleted: true };
  //   } catch (err) {
  //     throw new NotFoundException(err);
  //   }
  // }

  // async requestPhysicalCard(email: string) {
  //   try {
  //     const data: Omit<any, 'dataAgreement' | 'termsAgreement'> = {
  //       emailAddress: email,
  //       names: '',
  //       lastname: '',
  //       birthDate: '',
  //       gender: '',
  //       nationality: '',
  //       curp: '',
  //       rfc: '',
  //       residenceCountry: '',
  //       residenceState: '',
  //       address: '',
  //       kycData: '',
  //       birthPlace: '',
  //       phoneNumber: '',
  //       neighborhood: '',
  //       postalCode: '',
  //     };
  //     const user = await this.findVerifiedUser(data);

  //     if (!user) {
  //       throw new NotFoundException(`User with Email ${email} not found`);
  //     }

  //     const response =
  //       await this.notificationsService.sendMailRequestPhysicalCard(
  //         this.emailForPhysicalCards,
  //         email,
  //         'requestPhysicalCard.html',
  //         user.names,
  //         user.lastname,
  //         new Date().toISOString(),
  //         user.phone,
  //         user.curp,
  //         user.rfc,
  //         {
  //           street: user.address,
  //           colony: user.neighborhood,
  //           postalCode: user.postalCode,
  //           state: user.residenceState,
  //         },
  //       );

  //     const getUser = await this.userResultUsecasesProxy
  //       .getInstance()
  //       .findByEmail(email);

  //     await this.requestPhysicalCardUseCasesProxy.getInstance().insertSeveral([
  //       {
  //         userId: getUser.id,
  //         status: 'solicitada',
  //       },
  //     ]);

  //     return response;
  //   } catch (error) {
  //     this.handle.handleError('Error in requestPhysicalCard', error);
  //     throw error;
  //   }
  // }

  // async getPhysicalCardRequestStatus(userId: number) {
  //   try {
  //     const result = await this.requestPhysicalCardUseCasesProxy
  //       .getInstance()
  //       .findMostRecentByUserId(userId);

  //     return result;
  //   } catch (error) {
  //     this.handle.handleError('Error in getPhysicalCardRequestStatus', error);
  //     throw error;
  //   }
  // }

  // //update credit
  // async updateCreditAssignment(email: string, credit: CreditEvaluationDTO) {
  //   const creditString = JSON.stringify(credit);
  //   const findUser = await this.userUsecasesProxy
  //     .getInstance()
  //     .findByEmail(email);

  //   if (!findUser) {
  //     throw new NotFoundException(`El usuario no existe`);
  //   }

  //   const res = await this.userUsecasesProxy
  //     .getInstance()
  //     .updateCredit(email, creditString);
  //   return res;
  // }
  async updateUser(user: any) {
    return await this.prisma.verified_user.update({
      where: { id: user.id },
      data: user,
    });
  }

  async getUserIdForPomelo(email: string): Promise<any> {
    try {
      const res = await this.prisma.user.findFirst({
        where: { email: email },
      });
      return res ? res.id : 0;
    } catch (err) {
      throw new BadRequestException('Error in: UserService', err);
    }
  }

  async saveUserPomeloInfo(user: any) {
    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        pomelo_user_id: user.pomelo_user_id,
        virtual_card_id: user.virtual_card_id,
        sod_id: user.sod_id,
      },
    });
  }

  async getPomeloInfoByEmail(email: string): Promise<any> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: email },
        select: {
          id: true,
          pomelo_user_id: true,
          virtual_card_id: true,
          sod_id: true,
          physical_card_id: true,
          profile_image: true,
        },
      });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (err) {
      throw new BadRequestException('Error retrieving Pomelo info', err);
    }
  }
}
