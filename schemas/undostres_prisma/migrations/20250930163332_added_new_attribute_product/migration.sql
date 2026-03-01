-- CreateEnum
CREATE TYPE "undostres"."CardType" AS ENUM ('STATIC', 'DYNAMIC');

-- AlterTable
ALTER TABLE "undostres"."Product" ADD COLUMN     "cardType" "undostres"."CardType" NOT NULL DEFAULT 'STATIC';
