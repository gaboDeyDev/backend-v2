-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "SensitiveDataType" AS ENUM ('RFC', 'CURP', 'PHONE', 'SALARY', 'DEVICE_ID', 'ADDRESS', 'NSS', 'DRIVER_LICENSE', 'INE', 'PASSPORT');

-- CreateEnum
CREATE TYPE "AccountStatustype" AS ENUM ('ACTIVE', 'IN_PROGRESS', 'BLOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "VerificationProviderType" AS ENUM ('KYC', 'TRUORA', 'CIRCLE_CREDIT');

-- CreateEnum
CREATE TYPE "VerificationStatusType" AS ENUM ('APPROVED', 'FAILED', 'IN_PROGRESS', 'PENDING', 'UNDER_REVIEW_COMPLIANCE', 'PENDING_COMPLIANCE_REVIEW');

-- CreateEnum
CREATE TYPE "SalaryFrecuencyType" AS ENUM ('WEEKLY', 'MONTHLY', 'BIWEEKLY', 'FOURTEENTH');

-- CreateEnum
CREATE TYPE "InsuranceType" AS ENUM ('IMSS', 'ISSSTE');

-- CreateEnum
CREATE TYPE "ChargesType" AS ENUM ('AUXILIAR');

-- CreateEnum
CREATE TYPE "Rolestype" AS ENUM ('READER', 'WRITER');

-- CreateEnum
CREATE TYPE "CodeType" AS ENUM ('EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'RECOVERY_ACCOUNT');

-- CreateEnum
CREATE TYPE "ClosedReasonType" AS ENUM ('LOGOUT', 'TIMEOUT', 'ACCOUNT_DISABLED', 'MAX_ATTEMPTS', 'OTHER');

-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('PHYSICAL', 'LEGAL');

-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('UNION', 'COMPANY', 'INDIVIDUAL');

-- CreateTable
CREATE TABLE "t_accounts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "status" "AccountStatustype" NOT NULL DEFAULT 'IN_PROGRESS',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "processID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_customers" (
    "id" TEXT NOT NULL,
    "names" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "gender" "GenderType" NOT NULL,
    "birthState" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "residenceCountry" TEXT NOT NULL,
    "residenceState" TEXT NOT NULL,
    "person" "PersonType" NOT NULL DEFAULT 'PHYSICAL',
    "maritalStatus" TEXT,
    "accountID" TEXT,
    "pomelo_user_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "charge" "ChargesType" NOT NULL DEFAULT 'AUXILIAR',
    "role" "Rolestype" NOT NULL,
    "accountID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_sensitive_data" (
    "id" TEXT NOT NULL,
    "key" "SensitiveDataType" NOT NULL,
    "value" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "customerID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_sensitive_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_user_verifications_results" (
    "id" TEXT NOT NULL,
    "provider" "VerificationProviderType" NOT NULL,
    "status" "VerificationStatusType" NOT NULL,
    "result" TEXT NOT NULL,
    "verificationDate" TIMESTAMP(3) NOT NULL,
    "reference" TEXT,
    "customerID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_user_verifications_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_verification_codes" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expired" BOOLEAN NOT NULL DEFAULT false,
    "subject" "CodeType" NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "accountID" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_sessions" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "last_access" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "closed_reason" "ClosedReasonType",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "colony" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_employments" (
    "id" TEXT NOT NULL,
    "phone" TEXT,
    "extension" TEXT,
    "fax" TEXT,
    "position" TEXT,
    "department" TEXT,
    "hiring_day" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "monthly_salary" DOUBLE PRECISION NOT NULL,
    "last_day" TIMESTAMP(3),
    "verification_day" TIMESTAMP(3),
    "origin_company_address" TEXT,
    "salary_frecuency" "SalaryFrecuencyType" NOT NULL,
    "insurance" "InsuranceType" NOT NULL,
    "customerID" TEXT NOT NULL,
    "companyID" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_employments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_registration_procedures" (
    "id" TEXT NOT NULL,
    "accept_terms" BOOLEAN NOT NULL DEFAULT false,
    "accept_privacy" BOOLEAN NOT NULL DEFAULT false,
    "email_verification" BOOLEAN NOT NULL DEFAULT false,
    "phone_verification" BOOLEAN NOT NULL DEFAULT false,
    "password_changed" BOOLEAN NOT NULL DEFAULT false,
    "accept_product" BOOLEAN NOT NULL DEFAULT false,
    "identity_verification" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_registration_procedures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "t_accounts_email_key" ON "t_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "t_accounts_processID_key" ON "t_accounts"("processID");

-- CreateIndex
CREATE UNIQUE INDEX "t_customers_accountID_key" ON "t_customers"("accountID");

-- CreateIndex
CREATE UNIQUE INDEX "t_customers_pomelo_user_id_key" ON "t_customers"("pomelo_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_admin_accountID_key" ON "t_admin"("accountID");

-- CreateIndex
CREATE UNIQUE INDEX "t_employments_customerID_key" ON "t_employments"("customerID");

-- AddForeignKey
ALTER TABLE "t_accounts" ADD CONSTRAINT "t_accounts_processID_fkey" FOREIGN KEY ("processID") REFERENCES "t_registration_procedures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_customers" ADD CONSTRAINT "t_customers_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES "t_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_admin" ADD CONSTRAINT "t_admin_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES "t_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_sensitive_data" ADD CONSTRAINT "t_sensitive_data_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "t_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_user_verifications_results" ADD CONSTRAINT "t_user_verifications_results_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "t_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_verification_codes" ADD CONSTRAINT "t_verification_codes_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES "t_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_sessions" ADD CONSTRAINT "t_sessions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "t_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_employments" ADD CONSTRAINT "t_employments_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "t_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_employments" ADD CONSTRAINT "t_employments_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "t_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
