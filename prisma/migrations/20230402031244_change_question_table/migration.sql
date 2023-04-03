/*
  Warnings:

  - You are about to drop the column `answer` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `wrongAnswer` on the `Question` table. All the data in the column will be lost.
  - Added the required column `content` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correct_answer` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incorrect_answer1` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incorrect_answer2` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incorrect_answer3` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "answer",
DROP COLUMN "text",
DROP COLUMN "wrongAnswer",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "correct_answer" TEXT NOT NULL,
ADD COLUMN     "incorrect_answer1" TEXT NOT NULL,
ADD COLUMN     "incorrect_answer2" TEXT NOT NULL,
ADD COLUMN     "incorrect_answer3" TEXT NOT NULL;
