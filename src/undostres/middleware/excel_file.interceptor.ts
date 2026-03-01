import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as ExcelJS from 'exceljs';
import buildUndosTresObject from '../functions/buildUndosTresObject';

@Injectable()
export class ExcelFileInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

    const request = context.switchToHttp().getRequest();
    if (!request.file) {
      throw new Error('No file uploaded');
    }

    const file = request.file;

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);

    const worksheet = workbook.worksheets[0];

    const data = await buildUndosTresObject(worksheet);

    request.body = { data };

    return next.handle();
  }
}
