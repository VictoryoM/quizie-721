// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '@/lib/db/clients';
import QuizScoreRequest from '@/models/requests/QuizScoreRequest';
import Message from '@/models/requests/Message';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const request = <QuizScoreRequest>req.body;
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user?.email! },
    });
    if (!prismaUser || !request || request.messages.length === 0)
      return res.status(400).json({ message: 'Bad Request' });

    const answerTopicId = <number>request.messages[0].id;
    // console.log(answerTopicId);
    const findQuest = await prisma.question.findUnique({
      where: { id: answerTopicId },
    });

    let topicResult = await prisma.topicResult.findFirst({
      where: { userId: prismaUser!.id, topicId: findQuest?.topicId },
    });

    if (topicResult === null) {
      await prisma.topic.update({
        where: { id: findQuest?.topicId },
        data: { timesTaken: { increment: 1 } },
      });
      topicResult = await prisma.topicResult.create({
        data: {
          userId: prismaUser!.id,
          topicId: findQuest?.topicId!,
          average: 0,
          attemptNum: 1,
        },
      });
    } else {
      topicResult.attemptNum += 1;
    }

    let correctAnswers = topicResult.average;
    let corrects = 0;

    const prismaRequest = await Promise.all(
      request.messages.map(async (message: Message) => {
        let isAnswerCorrect = false;
        const answerChecker = await prisma.question.findUnique({
          where: { id: message.id },
        });
        if (answerChecker?.correct_answer === message.answer) {
          isAnswerCorrect = true;
          correctAnswers = correctAnswers + 1;
          corrects = corrects + 1;
        } else {
          isAnswerCorrect = false;
        }
        return {
          selectedOption: message.answer,
          questionId: message.id,
          userId: prismaUser!.id,
          isCorrect: isAnswerCorrect,
          topicResultId: topicResult?.id,
        };
      })
    );

    await prisma.answer.createMany({
      data: prismaRequest,
    });

    topicResult.average = correctAnswers;
    topicResult.correctNum = corrects;

    const updateTopicResult = await prisma.topicResult.update({
      where: { id: topicResult.id },
      data: topicResult,
    });

    let leaderboardUser = await prisma.leaderboard.findFirst({
      where: { userId: prismaUser!.id, topicId: findQuest?.topicId },
    });

    if (leaderboardUser === null) {
      leaderboardUser = await prisma.leaderboard.create({
        data: {
          userId: prismaUser!.id,
          topicId: findQuest?.topicId!,
          score: 1,
        },
      });
    } else {
      await prisma.leaderboard.update({
        where: { id: leaderboardUser.id },
        data: { score: leaderboardUser.score + 1 },
      });
    }

    res.status(200).json(topicResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}
