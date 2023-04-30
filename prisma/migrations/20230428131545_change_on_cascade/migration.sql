-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_topicResultId_fkey";

-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_userId_fkey";

-- DropForeignKey
ALTER TABLE "TopicResult" DROP CONSTRAINT "TopicResult_userId_fkey";

-- AlterTable
ALTER TABLE "Leaderboard" ALTER COLUMN "score" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "TopicResult" ALTER COLUMN "attemptNum" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_topicResultId_fkey" FOREIGN KEY ("topicResultId") REFERENCES "TopicResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicResult" ADD CONSTRAINT "TopicResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
