import { prisma } from '@/lib/db/clients';
import { Question, Topic } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

// const getQuizId = (quiz: Quiz) => {
//   return quiz.id;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      const questions = req.body; // Assuming req.body is an array of question objects
      // const quiz = await prisma.quiz.
      const createdQuestions = await Promise.all(
        questions.map(async (question: Question) => {
          const { question: q, correct_answer, options } = question;
          const post = await prisma.question.create({
            data: {
              question: q,
              correct_answer,
              options,
              topicId: 1,
            },
          });
          return post;
        })
      );
      // const quizId = getQuizId(quiz);
      res.status(201).json(createdQuestions);
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
