import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { UserVerifiedService } from './user-verified.service';
import { UserService } from './user.service';
import { UserVerifiedDto } from '../dtos/userVerify.dto';
import { NotificationsService } from './notofocations-service';
import { TempCodeService } from './temp-code.service';
import { verified_user } from '@prisma/client';
import { scorePersonDummy } from 'src/utils/circle-credit.dummy';
import { DomicilioDTO, PersonaDTO } from '../dtos/blaclistInput.dto';
import { scoreVerificationService } from './score-verification.service';
import { lastValueFrom } from 'rxjs';
import { CreditReport } from '../dtos/CreditReport';
import { CreditCircleAuditService } from './credit-circle-audit.service';
import { CreditAssignmentService } from './credit-assignment.service';
import { Credit } from 'src/model/creditModel';
import { TruoraService } from './truora.service';
import axios /*, { get } */ from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtTokenService } from 'src/auth/jwt.service';

const ProductTypes = {
  ON_DEMAND: 'OnDemand',
  MICRO_CREDIT: 'MicroCredit',
};

@Injectable()
export class CustomerService {
  constructor(
    private readonly userVerifiedServices: UserVerifiedService,
    private readonly userService: UserService,
    private readonly notificationsService: NotificationsService,
    private readonly tempCodeService: TempCodeService,
    private readonly blacklistService: scoreVerificationService,
    private readonly _creditCircleAuditService: CreditCircleAuditService,
    private readonly creditAssignmentService: CreditAssignmentService,
    private readonly truoraService: TruoraService,
    private configService: ConfigService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  execute(data: any): string {
    return 'Cambiar el metoto execute del customer service';
  }

  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  findAll() {
    return `This action returns all customer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }

  async registerForm(bodyProps: any) {
    const body: UserVerifiedDto = {
      names: bodyProps.name,
      lastname: bodyProps.lastName,
      birthPlace: bodyProps.birthState,
      nationality: bodyProps.nationality,
      birthDate: bodyProps.birthDate,
      gender: bodyProps.gender,
      address: `${bodyProps.legalStreetName} ${bodyProps.legalStreetNumber}, ${bodyProps.legalNeighborhood}, ${bodyProps.legalCity}`,
      residenceState: bodyProps.residenceState,
      residenceCountry: bodyProps.residenceCountry,
      curp: bodyProps.curp,
      rfc: bodyProps.rfc,
      emailAddress: bodyProps.emailAddress,
      phoneNumber: bodyProps.phoneNumber,
      neighborhood: bodyProps.legalNeighborhood,
      postalCode: bodyProps.legalZipCode,
      kycData: '', // Asigna el valor adecuado si lo tienes
      dataAgreement: bodyProps.policy,
      termsAgreement: bodyProps.terms,
      identityNumber: bodyProps.identityNumber,
      identityType: bodyProps.identityType,
      legal_street_name: bodyProps.legalStreetName,
      legal_street_number: bodyProps.legalStreetNumber,
      legal_zip_code: bodyProps.legalZipCode,
      legal_neighborhood: bodyProps.legalNeighborhood,
      legal_city: bodyProps.legalCity,
      legal_region: '', // Asigna el valor adecuado si lo tienes
      legal_municipality: bodyProps.legalMunicipality,
      legal_additional_info: bodyProps.legalAdditionalInfo,
      fathersLastname: '', // Asigna el valor adecuado si lo tienes
      mothersLastname: '', // Asigna el valor adecuado si lo tienes
      legal_floor: bodyProps.legalFloor,
      legal_apartment: bodyProps.legalApartment,
    };
    body.emailAddress = body.emailAddress.toLowerCase();
    const user = await this.userService.getUser(body.emailAddress);
    const verifiedUser = await this.userVerifiedServices.findUserByEmailAndNull(
      body.emailAddress,
    );

    if (verifiedUser != null) {
      throw new Error('Usuario ya existe en user-verified');
    }

    try {
      // await this.notificationsService.sendMail(
      //   body.emailAddress,
      //   'verificationProgrees.html',
      //   body.names,
      //   new Date().toISOString(),
      // );

      const existingUser =
        await this.userVerifiedServices.findVerifiedUser(body);


      if (!existingUser) {
        console.log('Usuario no existe, creando nuevo usuario');
        return await this.userVerifiedServices.createUserAndVerify({
          ...body,
          lastname: ' ',
        });
      } else {
        await this.userVerifiedServices.updateUserIfNeeded(body, existingUser);
        return `Usuario id: ${existingUser.id} actualizado exitosamente`;
      }
    } catch (error) {
      console.error('Error en verifyUser:', error);
      throw new Error('Error en verifyUser');
    }
  }

  async verifyKycStatus(
    email: string,
    acceptTcandPrivacity: boolean,
    acceptMarketing: boolean,
  ) {
    try {
      if (email == '') {
        throw new Error('Email no puede ser vacio');
      }
      let verified: boolean;
      let status: boolean = true;
      let password: boolean = false;
      const userVerified: UserVerifiedDto & { kyc_data: string } =
        await this.userVerifiedServices.findUserByEmail(email);
      console.log('userVerified', userVerified);
      console.log('userVerified.password', userVerified.password);
      console.log('userVerified.kycData', userVerified.kyc_data);

      if (userVerified.kyc_data == '') {
        verified = false;
        status = false;
      } else {
        verified = true;
        const blackListResult = JSON.parse(userVerified.kyc_data);
        if (blackListResult?.coincidences !== undefined) {
          status = false;
        }
      }
      if (userVerified.password && userVerified.password != '') {
        password = true;
      }
      if (!password) {
        // update user
        await this.userVerifiedServices.updateUserPreferences(
          email,
          String(acceptTcandPrivacity),
          String(acceptMarketing),
        );
      }
      console.log('verified', verified);
      console.log('status', status);
      console.log('userVerified.kyc_data', { verified, status, password });
      console.log('returning from verifyKycStatus');
      return { verified, status, password, statusCode: 200 };
    } catch (error) {
      console.error('Error in verifyKycStatus:', error);
      throw new Error('Error in verifyKycStatus');
    }
  }

  async checkIfExist(email: string) {
    if (email == '') {
      throw new Error('Email no puede ser vacio');
    }
    try {
      let verified: boolean;
      const status: boolean = true;
      const password: boolean = false;
      const userVerified: UserVerifiedDto & { kyc_data: string } =
        await this.userVerifiedServices.checkIfExistAccount(email);
      console.log('userVerified', userVerified);

      return {
        existAccount: userVerified ? true : false,
        statusCode: 200,
      };
    } catch (error) {
      console.error('Error in checkIfExist:', error);
    }
  }

  async signUp(data: any) {
    try {
      console.log('data', data);
      const getUser = await this.userService.getUser(data?.email);
      console.log('getUser', getUser);
      const getLoginId = await this.userService.getUserSalaryAndCat(data.email);
      console.log('getLoginId', getLoginId);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const objMail = {
        email: data.email,
        username: getUser.name,
        code: otp,
      };
      const hashedPassword = await bcrypt.hash(data.password, 10);
      await this.userService.updatePassword(data.email, hashedPassword);
      await this.tempCodeService.saveTempCode(data.email, otp);
      const userExist = await this.userService.getUser(data.email);
      console.log('userExist', userExist);
      // await this.userService.updateLoin(data.email, '1');
      // await this.notificationsService.sendOtp(objMail);
      console.log('return');
      return {
        ...data,
        user: {
          id: userExist.id,
          names: userExist.name,
          email: data.email,
          curp: 'encryptDataCURP',
          idLogin: getLoginId?.user?.cognito_id,
        },
        statusCode: 201,
      };
    } catch (error) {
      console.error('Error registering customer:', error);
    }
  }

  async logout(email: string) {
    try {
      console.log('email', email);
      await this.userService.updateLoin(email, '0');
      return {
        statusCode: 200,
        message: 'Logout successful',
      };
    } catch (error) {
      console.error('Error logging out customer:', error);
      return {
        statusCode: 500,
        message: 'Error logging out customer',
      };
    }
  }

  async sendMailOTP(data: any) {
    try {
      console.log('data', data);
      const getUser = await this.userService.getUser(data.email);
      console.log('getUser', getUser);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const objMail = {
        email: data.email,
        username: getUser.names,
        code: otp,
      };
      const res1 = await this.tempCodeService.saveTempCode(data.email, otp);
      const res2 = await this.notificationsService.sendOtp(objMail);
      console.log('return');
      return {
        getUser,
        statusCode: 200,
        message: 'OTP sent successfully',
        otp,
        objMail,
        res1,
        res2,
      };
    } catch (error) {
      console.error('Error registering customer:', error);
      return error;
    }
  }

  async sendMailOTPRecover(data: any) {
    try {
      console.log('data', data);
      const getUser = await this.userService.getUser(data.email);
      console.log('getUser', getUser);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const objMail = {
        email: data.email,
        username: getUser.names,
        code: otp,
      };
      const res1 = await this.tempCodeService.saveTempCodeRecover(
        data.email,
        otp,
      );
      const res2 = await this.notificationsService.sendOtpRecover(objMail);
      console.log('return');
      return {
        getUser,
        statusCode: 200,
        message: 'OTP sent successfully',
        otp,
        objMail,
        res1,
        res2,
      };
    } catch (error) {
      console.error('Error registering customer:', error);
      return error;
    }
  }

  async sendWhatsapp(data: any) {
    try {
      console.log('data', data);
      const getUser = await this.userService.getUser(data.email);
      console.log('getUser', getUser);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const objMail = {
        email: data.email,
        username: getUser.name,
        code: otp,
      };
      // await this.userService.updatePassword(data.email, data.password);
      await this.tempCodeService.saveTempCode(data.email, otp, 'whatsapp');
      const userExist = await this.userService.getUser(data.email);
      console.log('userExist', userExist);
      // await this.notificationsService.sendOtp(objMail);
      const whatsappApiUrl = this.configService.get<string>('WHATSAPP_API_URL');
      const whatsappPhoneId =
        this.configService.get<string>('WHATSAPP_PHONE_ID');
      // const url = `${process.env.WHATSAPP_API_URL}${process.env.WHATSAPP_PHONE_ID}/messages`;
      const url = `${whatsappApiUrl}${whatsappPhoneId}/messages`;
      // console.log('Verifying OTP for', body);
      const payload = {
        messaging_product: 'whatsapp',
        to: data.phone,
        type: 'template',
        template: {
          name: 'dey_user',
          language: { code: 'es_MX' },
          components: [
            {
              type: 'header',
              parameters: [{ type: 'TEXT', parameter_name: '1', text: otp }],
            },
          ],
        },
      };

      try {
        const whatsappApiKey =
          this.configService.get<string>('WHATSAPP_API_KEY');
        const response = await axios.post(url, payload, {
          headers: {
            Authorization: whatsappApiKey
              ? `Bearer ${whatsappApiKey}`
              : `Bearer EAARqOwEYv94BPLUNN0sdMIlf84ay04sAPDnjOgSWXe51CYfZCVdRQ0wIhkgwdu3kyVrWEFZBU59m7WfKe47ZBXdOnSsV2OUiECb5YBGLTxWgeZCqYKrvZAyHHl9KZAwCBKDs26xc1JvFkM8oHZCmubVFHrmAigy6z9jjzCsSMAAFtpW0N7uGPYn23yZAOr0ZBpKCPqgZDZD`,
            'Content-Type': 'application/json',
          },
        });
        // return response.data;
        console.log('WhatsApp message sent successfully:', response.data);
      } catch (error) {
        console.error(
          'Error sending WhatsApp message:',
          error.response ? error.response.data : error.message,
        );
        // throw new Error('Failed to send WhatsApp message');
      }
      console.log('return');
      return {
        ...data,
        user: {
          id: userExist.id,
          names: userExist.name,
          email: data.email,
          curp: 'encryptDataCURP',
        },
        statusCode: 201,
      };
    } catch (error) {
      console.error('Error registering customer:', error);
    }
  }

  async updatePreferences(id: number, body: any) {
    //     try {
    //    const user = await this.userUsecasesProxy
    //      .getInstance()
    //      .findById(+id);

    //    user.accepts_advertising = Boolean(+preferences.acceptsAdvertising);
    //    user.accepts_account_statements = Boolean(+preferences.acceptsAccountStatements);

    //    await this.userUsecasesProxy.getInstance().update(user);
    //  } catch (err) {
    //    this.handleservicesService.handleError('error in updatePreferences', err);
    //  }
    return { message: `Preferences for user ${id} updated successfully` };
  }

  async scoreVerification(emailAddress: string): Promise<any> {
    console.log('Starting scoreVerification for', emailAddress);
    const user: verified_user =
      await this.userVerifiedServices.findUserByEmail(emailAddress);
    if (!user) {
      throw new Error('Usuario no encontrado en verified_user');
    }
    try {
      // Usa configService para obtener la variable de entorno
      const useDataDummyScore =
        this.configService.get<string>('USE_DATA_DUMMY_SCORE') === 'true';
      // const useDataDummyScore = true;
      console.log(
        'USE_DATA_DUMMY_SCORE',
        this.configService.get<string>('USE_DATA_DUMMY_SCORE'),
      );
      console.log('personaConsultada', useDataDummyScore);
      const personaConsultada = useDataDummyScore
        ? scorePersonDummy
        : this.fillDataDTO(user);

      console.log('personaConsultada', personaConsultada);
      const resp = await lastValueFrom(
        this.blacklistService.sendRequest(personaConsultada),
      );
      this.saveUserData(user, resp.data);
      return resp.data;
    } catch (err) {
      console.error('Error en scoreVerification:', err);
      throw new Error('Error en scoreVerification');
    }
  }

  async saveUserData(user: verified_user, data: CreditReport) {
    user.circle_credit_data = JSON.stringify(data);
    user.circle_credit_data_last_checked = new Date().toISOString();
    this._creditCircleAuditService.getUserInfo(user, data.folioConsulta);
    await this.userVerifiedServices.updateUser(user);
  }

  fillDataDTO(user: verified_user): PersonaDTO {
    const domicilio = new DomicilioDTO();
    domicilio.direccion = String(user.address);
    domicilio.coloniaPoblacion = String(user.address)?.split(',')[0];
    domicilio.delegacionMunicipio = String(user.neighborhood);
    domicilio.ciudad = String(user.legal_city);
    domicilio.estado = String(user.residence_state);
    domicilio.CP = String(user.legal_zip_code);

    const persona = new PersonaDTO();
    // const existLastname = user?.lastname?.split(' ').length > 1;
    persona.apellidoPaterno = user.fathers_lastname || '';
    persona.apellidoMaterno = user.mothers_lastname || '';
    persona.primerNombre = user.names.toUpperCase();
    persona.fechaNacimiento = new Date(user.birth_date).toISOString(); // Formato: 'YYYY-MM-DD'
    persona.RFC = user.rfc;
    persona.nacionalidad = 'MX';
    persona.domicilio = domicilio;
    return persona;
  }

  async creditAssignment(body: any): Promise<any> {
    try {
      const info = JSON.parse(JSON.stringify(body));
      const user: verified_user =
        await this.userVerifiedServices.findUserByEmail(info.email);
      if (!user) {
        throw new Error('Usuario no encontrado en verified_user');
      }
      const userSalary = await this.userService.getUserSalary(info.email);
      const res = this.creditAssignmentService.CreditAssigment(
        user,
        userSalary,
      );
      const userId = await this.userService.getUserId(info.email);

      if (res.microcredit || res.onDemand) {
        const creditData: Credit = {
          productType: res.onDemand
            ? ProductTypes.ON_DEMAND
            : ProductTypes.MICRO_CREDIT,
          userId: String(userId),
          amountApproved: res.amount,
          dailyAmount: res.dailySalary,
        };

        await this.truoraService.moCustomerCreation(info.email);
      }

      user.credit = JSON.stringify(res);
      await this.userVerifiedServices.updateUser(user);
      return {
        message: res.microcredit
          ? 'Microcredit successfully assigned.'
          : res.onDemand
            ? 'On-demand credit successfully assigned.'
            : 'The user is not eligible for microcredit or on-demand services.',
        data: res,
      };
    } catch (error) {
      console.error('Error in creditAssignment:', error);
      throw new Error('Error in creditAssignment');
    }
  }
  async verifyOtp(email: string, code: string): Promise<any> {
    console.log('Verifying OTP for email:', email, 'with code:', code);
    const isValid = await this.tempCodeService.verifyTempCode(email, code);
    console.log('isValid', isValid);
    return {
      isValid,
    };
  }

  async verifyOtpPass(email: string, code: string, pass: string): Promise<any> {
    console.log('Verifying OTP for email:', email, 'with code:', code);
    const isValid = await this.tempCodeService.verifyTempCode(email, code);
    console.log('isValid', isValid);
    if (isValid) {
      await this.userService.updatePassword(email, pass);
    }
    return {
      isValid,
    };
  }

  async verifyOtpWhatsapp(email: string, code: string): Promise<any> {
    console.log('Verifying OTP for email:', email, 'with code:', code);
    const isValid = await this.tempCodeService.verifyTempCodeWhatsapp(
      email,
      code,
    );
    console.log('isValid', isValid);
    return {
      isValid,
    };
  }

  getUserSalary(email: string): Promise<any> {
    return this.userService.getUserSalary(email);
  }

  async getUserSalaryAndCat(email: string): Promise<any> {
    try {
      const response = await this.userService.getUserSalaryAndCat(email);
      console.log('response', response);
      return {
        // salary: response.user.salary,
        dailySalary: (Number(response.user.salary) / 7).toFixed(2),
        salaryAssigned: Number(response.user.salary) * 0.3,
        cat: 149.5,
        transferencia: '11%*',
        usoDey: '11%*',
        usoMarketplace: '$15.00*',
        tasaInteresOrdinaria: '95%*',
      };
    } catch (error) {
      console.error('Error in getUserSalaryAndCat:', error);
    }
  }

  async pomeloCustomerCreation(email: string): Promise<boolean> {
    return this.truoraService.pomeloCustomerCreation(email);
  }

  async login(body: any): Promise<any> {
    try {
      const generateCurrentId = uuidv4();
      console.log('generateCurrentId', generateCurrentId);
      console.log('data', body);
      const sesion = await this.userService.validateSession(body.email);
      console.log('sesion', sesion);
      if (sesion && sesion !== '0' && !body.skip) {
        return { message: 'User already logged in', statusCode: 409 };
      }
      const getUser = await this.userService.getUser(body.email);
      if (!getUser) {
        return { message: 'User not found', statusCode: 404 };
      }
      console.log('getUser', getUser);
      // const isPasswordValid = getUser.password === body.password;
      const isPasswordValid = await bcrypt.compare(
        body.password,
        getUser.password,
      );
      if (!isPasswordValid) {
        return { message: 'Invalid password', statusCode: 401 };
      }

      await this.userService.updateCurrentId(body.email, generateCurrentId);

      // Generate JWT Token
      const jwtPayload = {
        id: getUser.id,
        email: body.email,
        name: getUser.name,
        currentId: generateCurrentId,
      };

      const accessToken = this.jwtTokenService.generateAccessToken(jwtPayload);

      console.log('isPasswordValid', isPasswordValid);
      console.log({
        ...body,
        user: {
          id: getUser.id,
          names: getUser.name,
          email: body.email,
          curp: 'encryptDataCURP',
          generateCurrentId,
        },
        accessToken,
        statusCode: 200,
      });

      return {
          ...body,
        user: {
          id: getUser.id,
          names: getUser.name,
          email: body.email,
          curp: 'encryptDataCURP',
          generateCurrentId,
        },
        accessToken,
        statusCode: 200,
      };
    } catch (error) {
      console.error('Error logging in customer:', error);
      throw new Error('Error logging in customer');
    }
  }

  async refreshToken(email: string): Promise<any> {
    try {
      const getUser = await this.userService.getUser(email);
      if (!getUser) {
        return { message: 'User not found', statusCode: 404 };
      }
      const jwtPayload = {
        id: getUser.id,
        email: email,
        name: getUser.name,
      };

      const accessToken = this.jwtTokenService.generateAccessToken(jwtPayload);

      return    {
        accessToken,
        statusCode: 200,
      };
    } catch (error) {
      console.error('Error refreshing token for customer:', error);
      throw new Error('Error refreshing token for customer');
    }
  }

  async checkSession(email: string): Promise<any> {
    try {
      console.log('email', email);
      const sesion = await this.userService.validateSession(email);
      console.log('sesion', sesion);
      if (sesion && sesion !== '0') {
        return { validSession: false, currentId: sesion, statusCode: 200 };
      } else {
        return { validSession: true, statusCode: 200 };
      }
    } catch (error) {
      console.error('Error checking session for customer:', error);
      throw new Error('Error checking session for customer');
    }
  }
}
