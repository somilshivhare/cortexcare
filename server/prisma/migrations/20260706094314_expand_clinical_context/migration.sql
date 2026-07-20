/*
  Warnings:

  - You are about to drop the column `medicalHistory` on the `clinical_contexts` table. All the data in the column will be lost.
  - You are about to drop the column `medications` on the `clinical_contexts` table. All the data in the column will be lost.
  - Added the required column `consultationState` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentMedications` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lifestyle` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pastMedicalHistory` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentIllness` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riskFactors` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "extractedText" TEXT;

-- AlterTable
ALTER TABLE "clinical_contexts" DROP COLUMN "medicalHistory",
DROP COLUMN "medications",
ADD COLUMN     "consultationState" JSONB NOT NULL,
ADD COLUMN     "currentMedications" JSONB NOT NULL,
ADD COLUMN     "lifestyle" JSONB NOT NULL,
ADD COLUMN     "pastMedicalHistory" JSONB NOT NULL,
ADD COLUMN     "presentIllness" TEXT NOT NULL,
ADD COLUMN     "riskFactors" JSONB NOT NULL;
