/*
  Warnings:

  - You are about to drop the column `userId` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `quizId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_userId_fkey";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "quizId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
