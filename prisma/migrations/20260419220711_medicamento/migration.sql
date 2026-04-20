/*
  Warnings:

  - The primary key for the `medicamentos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `approved_by` on the `medicamentos` table. All the data in the column will be lost.
  - You are about to drop the column `composition` on the `medicamentos` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `medicamentos` table. All the data in the column will be lost.
  - You are about to drop the column `rejection_note` on the `medicamentos` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "medicamentos_barcode_key";

-- AlterTable
ALTER TABLE "medicamentos" DROP CONSTRAINT "medicamentos_pkey",
DROP COLUMN "approved_by",
DROP COLUMN "composition",
DROP COLUMN "id",
DROP COLUMN "rejection_note",
ADD COLUMN     "activeIngredient" TEXT,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "presentation" TEXT,
ADD CONSTRAINT "medicamentos_pkey" PRIMARY KEY ("barcode");
