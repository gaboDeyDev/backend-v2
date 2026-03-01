-- CreateEnum
CREATE TYPE "undostres"."ReferenceType" AS ENUM ('CODIGA_BARRAS', 'REFERENCIA_PAGO', 'NUMERO_SERVICIO', 'NUMERO_CUENTA', 'NUMERO_USUARIO', 'NUMERO_TELEFONO', 'NUMERO_TAG');

-- CreateTable
CREATE TABLE "undostres"."Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "undostres"."Provider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryID" INTEGER NOT NULL,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "undostres"."Product" (
    "id" SERIAL NOT NULL,
    "skuid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "facturable" BOOLEAN NOT NULL DEFAULT false,
    "validateLength" TEXT,
    "fetchAmount" BOOLEAN NOT NULL DEFAULT false,
    "maxAmount" DECIMAL(65,30),
    "minAmount" DECIMAL(65,30),
    "acceptPartialPayment" BOOLEAN NOT NULL DEFAULT false,
    "extraFields" TEXT,
    "providerId" INTEGER NOT NULL,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_skuid_key" ON "undostres"."Product"("skuid");

-- CreateIndex
CREATE INDEX "idx_provider" ON "undostres"."Product"("providerId");

-- AddForeignKey
ALTER TABLE "undostres"."Provider" ADD CONSTRAINT "Provider_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "undostres"."Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "undostres"."Product" ADD CONSTRAINT "Product_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "undostres"."Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
