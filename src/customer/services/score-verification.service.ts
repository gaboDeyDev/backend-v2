import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError } from 'rxjs';
import { Observable } from 'rxjs';
import { Person } from '../dtos/BlacklistModel';
import { CreditReport } from '../dtos/credit_report.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class scoreVerificationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  sendRequest(data: Person): Observable<AxiosResponse<CreditReport>> {
    // const url = `${process.env.BLACKLIST_URL}/v1/rcc-ficoscore-pld`;
    const url = `${this.configService.get('BLACKLIST_URL')}/v1/rcc-ficoscore-pld`;
    // const apiKey = process.env.BLACKLIST_API_KEY;
    const apiKey = this.configService.get('BLACKLIST_API_KEY');

    // const url = `https://services.circulodecredito.com.mx/sandbox/v1/rcc-ficoscore-pld`;
    // const apiKey = 'vAYRj4tZxiCDLtBQ9lU81kUnHtY7TuQ5';

    const headers = {
      accept: 'application/json',
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    };

    return this.httpService.post(url, data, { headers }).pipe(
      catchError(error => {
        throw `Ocurrió un error solicitando consulta: ${JSON.stringify(
          error?.response?.data,
        )}`;
      }),
    );
  }
}
