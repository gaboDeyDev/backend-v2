/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "undostres"."Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_name_key" ON "undostres"."Provider"("name");
