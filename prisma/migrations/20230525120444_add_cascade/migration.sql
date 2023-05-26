-- DropForeignKey
ALTER TABLE "TopicResult" DROP CONSTRAINT "TopicResult_topicId_fkey";

-- AddForeignKey
ALTER TABLE "TopicResult" ADD CONSTRAINT "TopicResult_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
