import { prisma } from '@/lib/db/clients';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  interface DeleteRecord {
    id: number;
  }
  try {
    const request = <DeleteRecord>req.body;

    if (!request) return res.status(400).json({ message: 'Bad Request' });
    const data = await prisma.question.findMany({
      where: {
        topicId: request.id,
      },
      select: {
        id: true,
        topicId: true,
        question: true,
        createdAt: true,
      },
    });

    res.status(200).json({ message: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}
