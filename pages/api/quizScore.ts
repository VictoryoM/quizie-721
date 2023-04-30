// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '@/lib/db/clients';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const pickedAnswers = req.body.messages;
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user?.email! },
    });
    if (!prismaUser || !pickedAnswers || pickedAnswers.length === 0) {
      res.status(401).json({ message: 'Unauthorized' });
    } else if (pickedAnswers.length > 0 && prismaUser) {
      const answerTopicId = await prisma.question.findUnique({
        where: { id: pickedAnswers[0].id },
      });

      const topicTaken = await prisma.topicResult.findFirst({
        where: { userId: prismaUser!.id, topicId: answerTopicId?.topicId },
      });
      if (topicTaken === null) {
        const topicResult = await prisma.topicResult.create({
          data: {
            userId: prismaUser!.id,
            topicId: answerTopicId?.topicId!,
            average: 0,
            attemptNum: 1,
          },
        });
      } else {
        const topicResult = await prisma.topicResult.update({
          where: { id: topicTaken.id },
          data: {
            attemptNum: topicTaken?.attemptNum! + 1,
          },
        });
      }

      let correctAnswers = 0;
      const createAnswer = await Promise.all(
        pickedAnswers.map(async (answer: any) => {
          const { id: qesId, answer: choosenAnswer } = answer;
          const topicAverage = await prisma.topicResult.findFirst({
            where: { userId: prismaUser!.id, topicId: answerTopicId?.topicId },
          });
          let isAnswerCorrect = false;
          const answerChecker = await prisma.question.findUnique({
            where: { id: qesId },
          });
          if (answerChecker?.correct_answer === choosenAnswer) {
            isAnswerCorrect = true;
            correctAnswers = correctAnswers + 1;
          } else {
            isAnswerCorrect = false;
          }
          const post = await prisma.answer.create({
            data: {
              selectedOption: choosenAnswer,
              questionId: qesId,
              userId: prismaUser!.id,
              isCorrect: isAnswerCorrect,
              topicResultId: topicAverage?.id,
            },
          });

          console.log(correctAnswers);
        })
      );
      const updateTopicResult = await prisma.topicResult.update({
        where: { id: topicTaken?.id! },
        data: {
          average: correctAnswers,
        },
      });

      res.status(200).json({ result: pickedAnswers });
    } else {
      res.status(401).json({ message: 'You are not authorized' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}
