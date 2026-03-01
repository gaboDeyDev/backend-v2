import { ReferenceType } from "schemas/undostres_prisma/generated/prisma";

export class UndostresModel{
    category: string;
    provider: string;
    name?:string;
    skuId: number;
    price: number;
    description?: string;
    facturable: boolean;
    validateLength?: string;
    fetchAmount?: boolean;
    maxAmount?: number;
    minAmount?: number
    paymentReferenceType?: ReferenceType;
    acceptPartialPayment: boolean;
    extraFields?: any;
    cardType?: string;
}