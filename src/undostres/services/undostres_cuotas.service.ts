import { Injectable } from '@nestjs/common';
import { UndostresPrismaService } from '../db/undostres_prisma.service';
import { UndostresModel } from '../data/model/undostres.model';
import { CardType, Prisma } from 'schemas/undostres_prisma/generated/prisma';

@Injectable()
export class UndostresCuotasService {
  constructor(private readonly undostresRepository: UndostresPrismaService) {}

  async saveCuotas(cuotas: UndostresModel[]) {
    return await Promise.allSettled(
      cuotas.map(async (cuota, index) => {
        console.log(cuota);

        try {
            await this.undostresRepository.product.create({
          data: {
            provider: {
              connectOrCreate: {
                where: { name: cuota.provider },
                create: {
                  name: cuota.provider,
                  category: {
                    connectOrCreate: {
                      where: { name: cuota.category },
                      create: { name: cuota.category },
                    },
                  },
                },
              },
            },
            name: cuota.name,
            skuid: cuota.skuId,
            price: new Prisma.Decimal(cuota.price),
            description: cuota.description,
            facturable: cuota.facturable,
            validateLength: `${cuota.validateLength}`,
            fetchAmount: cuota.fetchAmount,
            maxAmount: cuota.maxAmount
              ? new Prisma.Decimal(cuota.maxAmount)
              : undefined,
            minAmount: cuota.minAmount
              ? new Prisma.Decimal(cuota.minAmount)
              : undefined,
            acceptPartialPayment: cuota.acceptPartialPayment,
            extraFields: `${cuota.extraFields}`,
            paymentReferenceType: cuota.paymentReferenceType || 'NUMERO_TELEFONO',
            cardType: cuota.cardType as CardType || CardType.STATIC,
          },
        });
      } catch (error) {
        console.error('Error saving cuota:', error);
        throw {index, error};
      }

      return index;
    }),
    );
  }

  async getServiceFromSkuId(skuId: number): Promise<UndostresModel | null> {
    const product = await this.undostresRepository.product.findFirst({
      where: { skuid: Number(skuId) },
      include: { provider: { include: { category: true } } },
    });

    if (!product) return null;

    return {
      name: product.name!,
      skuId: product.skuid,
      price: Number(product.price!),
      description: product.description!,
      facturable: product.facturable,
      validateLength: product.validateLength!,
      fetchAmount: product.fetchAmount,
      maxAmount: Number(product.maxAmount!),
      minAmount: Number(product.minAmount!),
      acceptPartialPayment: product.acceptPartialPayment,
      extraFields: product.extraFields,
      paymentReferenceType: product.paymentReferenceType,
      category: product.provider.category.name ?? '',
      provider: product.provider.name ?? '',
      cardType: product.cardType,
    };
  }
}
