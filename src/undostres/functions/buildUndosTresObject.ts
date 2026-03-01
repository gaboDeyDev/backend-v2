import * as ExcelJS from 'exceljs';
import { UndostresModel } from '../data/model/undostres.model';
import { CardType, ReferenceType } from 'schemas/undostres_prisma/generated/prisma';

export default async (
  workSheet: ExcelJS.Worksheet,
): Promise<UndostresModel[]> => {
  const undostresData: UndostresModel[] = [];

  workSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    console.log(
      `position (5): ${(row.getCell(5).value as string)}`,
    );

    console.log(row.values);

    console.log(rowNumber);

    const undostresItem: UndostresModel = {
      category: row.getCell(1).value as string,
      provider: row.getCell(2).value as string,
      skuId: row.getCell(3).value as number,
      name: row.getCell(4).value as string,
      price: row.getCell(5).value
        ? parseFloat(String(row.getCell(5).value).replace(/[$,]/g, ''))
        : 0.0,
      description: row.getCell(6).value as string,
      facturable: (row.getCell(7).value as string)?.toLowerCase() === 'true',
      validateLength: row.getCell(8).value as string,
      fetchAmount: row.getCell(9).value
        ? (row.getCell(9).value as string).toLowerCase() === 'true'
        : undefined,
      maxAmount: row.getCell(10).value as number,
      minAmount: row.getCell(11).value as number,
      acceptPartialPayment: row.getCell(12).value
        ? (row.getCell(12).value as string).toLowerCase() === 'true'
        : false,
      extraFields: row.getCell(13).value
        ? JSON.parse(row.getCell(13).value as string)
        : {},
      paymentReferenceType: row.getCell(14).value as ReferenceType,
      cardType: row.getCell(15).value ? row.getCell(15).value as string : CardType.STATIC,
    };

    undostresData.push(undostresItem);
  });

  return undostresData;
};
