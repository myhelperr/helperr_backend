/*
  Warnings:

  - You are about to drop the column `documentNumber` on the `identity_verifications` table. All the data in the column will be lost.
  - Added the required column `city` to the `identity_verifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `identity_verifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `identity_verifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `identity_verifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "identity_verifications" DROP COLUMN "documentNumber",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;
