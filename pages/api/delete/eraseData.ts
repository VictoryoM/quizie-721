import { prisma } from '@/lib/db/clients';
import { BannedTopic } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  interface DeleteRecord {
    id: number;
    name: string;
  }
  try {
    const request = <DeleteRecord>req.body;

    if (!request) return res.status(400).json({ message: 'Bad Request' });

    const record = request.name;
    if (record === 'bannedTopic') {
      await prisma.bannedTopic.delete({
        where: {
          id: request.id,
        },
      });
      res.status(200).json('Success Delete Banned Topic');
    } else if (record === 'topic') {
      await prisma.topic.delete({
        where: {
          id: request.id,
        },
      });
      res.status(200).json('Success Delete Topic');
    }
    //error 400
    res.status(400).json({ message: 'Bad Request' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}
