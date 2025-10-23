-- DropIndex
DROP INDEX "public"."identity_verifications_userId_key";

-- AlterTable
ALTER TABLE "identity_verifications" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "identity_verifications_userId_idx" ON "identity_verifications"("userId");
