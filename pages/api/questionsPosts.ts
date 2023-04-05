import { prisma } from '@/lib/db/clients';
import { Question, Quiz } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      const questions = req.body; // Assuming req.body is an array of question objects
      const createdQuestions = await Promise.all(
        questions.map(async (question: Question) => {
          const { question: q, correct_answer, options } = question;
          const post = await prisma.question.create({
            data: {
              question: q,
              correct_answer,
              options,
              quizId: 1,
            },
          });
          return post;
        })
      );
      res.status(201).json(createdQuestions);
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
