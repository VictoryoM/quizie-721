-- CreateTable
CREATE TABLE "BannedTopic" (
    "id" SERIAL NOT NULL,
    "topicBanned" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BannedTopic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BannedTopic_topicBanned_key" ON "BannedTopic"("topicBanned");
