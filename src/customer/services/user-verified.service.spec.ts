import { Test, TestingModule } from '@nestjs/testing';
import { UserVerifiedService } from './user-verified.service';
import { DrizzleConfig } from 'src/infrastructure/config/drizzle/config';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { KycserviceService } from '../kycservice/kycservice.service';
import { HandleservicesService } from '../handleservices/handleservices.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { NotificationsService } from '../notifications/notifications.service';
import { HttpModule } from '@nestjs/axios';
import { CreditAssignmentService } from '../credit-assignment/credit-assignment.service';
import { UserVerifiedDto } from 'src/infrastructure/dto/userVerify.dto';
import { SearchListModel } from 'src/domain/model/SearchListModel';
import { CreditService } from '../credit/credit.service';
import { UserService } from '../user/user.service';
import { TransactionsService } from '../transactions/transactions.service';
import { MoService } from '../mo/mo.service';
import { ConfigService } from '@nestjs/config';

const creditServiceMock = jest.fn();
const userServiceMock = jest.fn();

describe('UserVerifiedService', () => {
  let service: UserVerifiedService;
  let kycService: KycserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, UsecasesProxyModule.register(), DrizzleConfig],
      providers: [
        UserVerifiedService,
        KycserviceService,
        { provide: NotificationsService, useValue: jest.fn() },
        { provide: HandleservicesService, useValue: jest.fn() },
        { provide: LoggerService, useValue: jest.fn() },
        { provide: ExceptionsService, useValue: jest.fn() },
        { provide: CreditAssignmentService, useValue: jest.fn() },
        {
          provide: CreditService,
          useValue: creditServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        { provide: TransactionsService, useValue: jest.fn() },
        { provide: MoService, useValue: jest.fn() },
                {
                  provide: ConfigService,
                  useValue: {
                    get: jest.fn().mockImplementation((key: string) => {
                      if (key === 'application') {
                        return {
                          useDataDummyScore: true,
                          useEmploymentVerificationDummy: true,
                          emailPhysicalCards: 'gabriel.tolentino@therocketcode.com'
                        };
                      }
                      return undefined;
                    }),
                  },
                },
      ],
    }).compile();

    service = module.get<UserVerifiedService>(UserVerifiedService);
    kycService = module.get<KycserviceService>(KycserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should build correct payload from user data', () => {
    const userDto: UserVerifiedDto = {
      names: 'John',
      lastname: 'John Doe',
      birthPlace: 'Mexico City',
      nationality: 'Mexican',
      birthDate: '1990-01-01',
      gender: 'Male',
      address: '123 Main St',
      residenceState: 'CDMX',
      residenceCountry: 'Mexico',
      curp: 'CURP1234567890',
      rfc: 'RFC123456789',
      emailAddress: 'john.doe@example.com',
      phoneNumber: '5551234567',
      neighborhood: 'Centro',
      postalCode: '01000',
      kycData: '{}',
      dataAgreement: true,
      termsAgreement: true
    };

    const expectedPayload: SearchListModel = {
      persona: '1',
      nombre: 'John',
      apaterno: 'John',
      amaterno: 'Doe',
    };

    const payload = kycService.buildPayloadFromUser(userDto);

    expect(payload).toEqual(expectedPayload);
  });

  it('should determine if user has passed verification threshold', () => {
    const lastVerifiedAt = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago

    const result = kycService.hasPassedVerificationThreshold(lastVerifiedAt);

    expect(result).toBe(true);
  });

  it('should determine if user has not passed verification threshold', () => {
    const lastVerifiedAt = new Date(); // 30 minutes ago

    const result = kycService.hasPassedVerificationThreshold(lastVerifiedAt);

    expect(result).toBe(false);
  });
});
