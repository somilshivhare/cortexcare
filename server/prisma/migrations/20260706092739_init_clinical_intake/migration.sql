/*
  Warnings:

  - You are about to drop the column `confidenceScore` on the `clinical_contexts` table. All the data in the column will be lost.
  - You are about to drop the column `mood` on the `clinical_contexts` table. All the data in the column will be lost.
  - You are about to drop the column `recommendations` on the `clinical_contexts` table. All the data in the column will be lost.
  - You are about to drop the column `riskFlags` on the `clinical_contexts` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `clinical_contexts` table. All the data in the column will be lost.
  - You are about to drop the `conversation_chunks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `allergies` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chiefComplaint` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorSummary` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicalHistory` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medications` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendedSpecialist` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riskLevel` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeline` to the `clinical_contexts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "conversation_chunks" DROP CONSTRAINT "conversation_chunks_consultationId_fkey";

-- AlterTable
ALTER TABLE "clinical_contexts" DROP COLUMN "confidenceScore",
DROP COLUMN "mood",
DROP COLUMN "recommendations",
DROP COLUMN "riskFlags",
DROP COLUMN "summary",
ADD COLUMN     "allergies" JSONB NOT NULL,
ADD COLUMN     "chiefComplaint" TEXT NOT NULL,
ADD COLUMN     "doctorSummary" TEXT NOT NULL,
ADD COLUMN     "medicalHistory" JSONB NOT NULL,
ADD COLUMN     "medications" JSONB NOT NULL,
ADD COLUMN     "recommendedSpecialist" TEXT NOT NULL,
ADD COLUMN     "riskLevel" TEXT NOT NULL,
ADD COLUMN     "timeline" JSONB NOT NULL;

-- DropTable
DROP TABLE "conversation_chunks";

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "speaker" "SpeakerRole" NOT NULL,
    "text" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "cloudinaryUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "messages_consultationId_sequence_key" ON "messages"("consultationId", "sequence");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "consultations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "consultations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
