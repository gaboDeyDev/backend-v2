-- AlterTable
ALTER TABLE "undostres"."Product" ADD COLUMN     "paymentReferenceType" "undostres"."ReferenceType" NOT NULL DEFAULT 'NUMERO_TELEFONO',
ALTER COLUMN "name" DROP NOT NULL;
