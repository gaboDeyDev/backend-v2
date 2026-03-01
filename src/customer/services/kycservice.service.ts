import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { UserRiskVerification } from '../dtos/UserRiskVerification';
import { UserVerifiedDto } from '../dtos/userVerify.dto';
import { SearchListModel } from 'src/model/SearchListModel';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class KycserviceService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  searchInLists(
    payload: SearchListModel,
  ): Observable<AxiosResponse<UserRiskVerification>> {
    const url = this.configService.get<string>('KYC_URL');
    const apiKey = this.configService.get<string>('KYC_API_KEY');

    return this.httpService.post(String(url), payload, {
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  buildPayloadFromUser(user: UserVerifiedDto) {
    // const [apaterno, amaterno] = user?.lastname?.split(' ');
    return {
      persona: '1',
      nombre: user.names,
      apaterno: user.fathersLastname || '',
      amaterno: user.mothersLastname || '',
    };
  }

  hasPassedVerificationThreshold(lastVerifiedAt: Date): boolean {
    const twoHoursAgo = new Date(Date.now() - 2 * 2 * 60 * 1000);
    return new Date(lastVerifiedAt) < twoHoursAgo;
  }
}
