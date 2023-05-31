import { prisma } from '@/lib/db/clients';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    // if (!session) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }
    const userResults = await prisma.topicResult.findMany({
      where: {
        user: {
          email: session?.user?.email || 'none',
        },
      },
      orderBy: {
        attemptNum: 'desc',
      },
      select: {
        average: true,
        attemptNum: true,
        correctNum: true,
        updatedAt: true,
        topic: {
          select: {
            titleTopic: true,
          },
        },
      },
    });
    return res.status(200).json(userResults);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}
