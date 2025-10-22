/*
  Warnings:

  - A unique constraint covering the columns `[verificationId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verificationId" TEXT;

-- CreateTable
CREATE TABLE "identity_verifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "documentImage" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "identity_verifications_userId_key" ON "identity_verifications"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationId_key" ON "users"("verificationId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "identity_verifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
