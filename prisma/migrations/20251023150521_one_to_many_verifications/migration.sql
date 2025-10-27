/*
  Warnings:

  - You are about to drop the column `verificationId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_verificationId_fkey";

-- DropIndex
DROP INDEX "public"."users_verificationId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "verificationId";

-- AddForeignKey
ALTER TABLE "identity_verifications" ADD CONSTRAINT "identity_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
