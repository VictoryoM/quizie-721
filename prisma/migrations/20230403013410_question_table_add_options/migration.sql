/*
  Warnings:

  - You are about to drop the column `content` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `incorrect_answer1` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `incorrect_answer2` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `incorrect_answer3` on the `Question` table. All the data in the column will be lost.
  - Added the required column `question` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "content",
DROP COLUMN "incorrect_answer1",
DROP COLUMN "incorrect_answer2",
DROP COLUMN "incorrect_answer3",
ADD COLUMN     "options" TEXT[],
ADD COLUMN     "question" TEXT NOT NULL;
