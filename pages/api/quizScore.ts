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
      select: { topicId: true, topic: { select: { level: true } } },
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
      select: { score: true, id: true },
    });

    // const leaderboardScore = leaderboardUser?.score
    //   ? leaderboardUser.score + corrects
    //   : corrects;
    let leaderboardScorePrev = leaderboardUser?.score || 0;
    let leaderboardScore = 0;
    if (findQuest?.topic.level === 'Easy') {
      leaderboardScore = leaderboardScorePrev + corrects * 1;
    } else if (findQuest?.topic.level === 'Medium') {
      leaderboardScore = leaderboardScorePrev + corrects * 2;
    } else if (findQuest?.topic.level === 'Hard') {
      leaderboardScore = leaderboardScorePrev + corrects * 3;
    } else {
      leaderboardScore = corrects * 1;
    }

    if (leaderboardUser === null) {
      leaderboardUser = await prisma.leaderboard.create({
        data: {
          userId: prismaUser!.id,
          topicId: findQuest?.topicId!,
          score: leaderboardScore,
        },
      });
    } else {
      await prisma.leaderboard.update({
        where: { id: leaderboardUser.id },
        data: { score: leaderboardScore },
      });
    }

    res.status(200).json(topicResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}

// let leaderboardUser = await prisma.leaderboard.findFirst({
//   where: { userId: prismaUser!.id, topicId: findQuest?.topicId },
//   select: { score: true, id: true },
// });
// // const leaderboardScore = leaderboardUser?.score
// //   ? leaderboardUser.score + corrects
// //   : corrects;
// let leaderboardScorePrev = leaderboardUser?.score || 0;
// let leaderboardScore = 1;
// // if (findQuest?.topic.level === 'easy') {
// //   leaderboardScore = leaderboardScorePrev + corrects * 1;
// // } else if (findQuest?.topic.level === 'medium') {
// //   leaderboardScore = leaderboardScorePrev + corrects * 2;
// // } else if (findQuest?.topic.level === 'hard') {
// //   leaderboardScore = leaderboardScorePrev + corrects * 3;
// // } else {
// //   leaderboardScore = corrects * 1;
// // }

// if (leaderboardUser === null) {
//   const leaderboardUser = await prisma.leaderboard.create({
//     data: {
//       userId: prismaUser!.id,
//       topicId: findQuest?.topicId!,
//       score: leaderboardScore,
//     },
//   });
// } else {
//   await prisma.leaderboard.update({
//     where: { id: leaderboardUser.id },
//     data: { score: leaderboardScore },
//   });
// }
