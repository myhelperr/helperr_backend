/*
  Warnings:

  - The `status` column on the `identity_verifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "VERIFICATION_STATUS" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "identity_verifications" DROP COLUMN "status",
ADD COLUMN     "status" "VERIFICATION_STATUS" NOT NULL DEFAULT 'PENDING';
