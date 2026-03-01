import { Inject, Injectable } from '@nestjs/common';
// import { format } from 'date-fns';
// import {
//   CreditCircleAuditInterface,
//   // CreditCircleAuditResponseInterface,
// } from 'src/domain/model/CreditCirlceMode';
// import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
// import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
// import { CreditCircleAuditResultUseCases } from 'src/usecases/creditCircleAuditResult.usecases';
import { verified_user } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserVerifiedService } from './user-verified.service';
import { CreditCircleAuditInterface } from 'src/model/CreditCirlceMode';
// import { ExpressFile, FileService } from '../file-service/file.service';
// import { circleCreditFileDto } from 'src/infrastructure/dto/circleCreditFile.dto';

@Injectable()
export class CreditCircleAuditService {
  user: CreditCircleAuditInterface;

  constructor(
    // @Inject(UsecasesProxyModule.CREDIT_CIRCLE_AUDIT_USECASES_PROXY)
    // private _userUsecasesProxy: UseCaseProxy<CreditCircleAuditResultUseCases>,
    private readonly _userVerifiedService: UserVerifiedService,
    private readonly prisma: PrismaService,
    // private readonly _fileService: FileService,
  ) { }

  fileHeaders = [
    'FOLIO_CDC',
    'FECHA_CONSULTA',
    'HORA_CONSULTA',
    'NOMBRE_CLIENTE',
    'RFC',
    'CALLE_NUMERO',
    'CIUDAD',
    'Estado',
    'TIPO_CONSULTA',
    'USUARIO',
    'FECHA_APROBACION_DE_CONSULTA',
    'HORA_APROBACION_DE_CONSULTA',
    'INGRESO_NUEVAMENTE_NIP',
    'RESPUESTA_LEYENDA_DE_AUTORIZACION',
    'ACEPTACION_TERMINOS_Y_CONDICIONES',
  ];

  // async createAudit(user: CreditCircleAuditInterface) {
  //   return await this._userUsecasesProxy.getInstance().insert(user);
  // }

  async getUserInfo(user: verified_user, folio: string) {
    let userId: string = '';
    await this._userVerifiedService.findUserByEmail(user.email).then(userFound => {
      userId = userFound ? `${userFound.id}` : '';
    });

    this.user = {
      folio: folio,
      rfc: user.rfc,
      user: userId,
      client_name: `${user.names.toUpperCase()} ${user.lastname.toUpperCase()}`,
      date_approved: new Date(),
      address: String(user.address),
      city: user.residence_country,
      state: user.residence_state,
    };
    await this.prisma.credit_circle_audit.create({
      data: {
        folio: this.user.folio,
        rfc: this.user.rfc,
        user: userId,
        client_name: this.user.client_name,
        date_approved: this.user.date_approved,
        address: this.user.address,
        city: this.user.city,
        state: this.user.state,
      },
    });
    // return await this.createAudit(this.user);
    
  }

  // // BUILDUING A FILE
  // async getAllData(startDate: Date, endDate: Date) {
  //   const result = (
  //     await this._userUsecasesProxy.getInstance().findAll()
  //   ).filter(data => {
  //     const date = new Date(data.date_searched);
  //     return (
  //       date.setHours(1, 1, 1) >= startDate.setHours(0, 1, 1) &&
  //       date.setHours(1, 1, 1) <= endDate.setHours(59, 59, 59)
  //     );
  //   });
  //   return result;
  // }

  // transformData(data: CreditCircleAuditResponseInterface[]) {
  //   return data.map(item => ({
  //     FOLIO_CDC: item.folio,
  //     FECHA_CONSULTA: format(item.date_searched, 'P'),
  //     HORA_CONSULTA: format(item.date_searched, 'pp'),
  //     NOMBRE_CLIENTE: item.client_name,
  //     RFC: item.rfc,
  //     CALLE_NUMERO: item.address,
  //     CIUDAD: item.city,
  //     Estado: item.state,
  //     TIPO_CONSULTA: item.query_type,
  //     USUARIO: item.user,
  //     FECHA_APROBACION_DE_CONSULTA: format(item.date_approved, 'P'),
  //     HORA_APROBACION_DE_CONSULTA: format(item.date_approved, 'pp'),
  //     INGRESO_NUEVAMENTE_NIP: item.entry_pin_again,
  //     RESPUESTA_LEYENDA_DE_AUTORIZACION: item.legend_authorization,
  //     ACEPTACION_TERMINOS_Y_CONDICIONES: item.tems_and_conditions,
  //   }));
  // }

  // async uploadFile(query: circleCreditFileDto) {
  //   const result: CreditCircleAuditResponseInterface[] = await this.getAllData(
  //     new Date(query.from),
  //     new Date(query.to),
  //   );

  //   const csvEncabezados = this.fileHeaders.join(';') + '\n';

  //   const csvData =
  //     csvEncabezados +
  //     this.transformData(result)
  //       .map(value => Object.values(value).join(';'))
  //       .join('\n');

  //   const csvBuffer = Buffer.from(csvData);
  //   const tempFile: ExpressFile = {
  //     fieldname: 'credit-circle',
  //     originalname: 'credit_circle/data.csv',
  //     encoding: '7bit',
  //     mimetype: 'text/csv',
  //     size: csvBuffer.length,
  //     buffer: csvBuffer,
  //   };
  //   return await this._fileService.uploadFile(tempFile);
  // }
}
