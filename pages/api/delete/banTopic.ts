import { prisma } from '@/lib/db/clients';
import { BannedTopic } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // console.log(req.body);

    const { topicBanned }: BannedTopic = req.body;

    if (!topicBanned) return res.status(400).json({ message: 'Bad Request' });

    const words = topicBanned.toLowerCase().split(' ');
    const capitalizedWords = words.map(
      (word: String) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    const topicBan = capitalizedWords.join(' ');
    console.log(topicBan);

    const addTopicBan = await prisma.bannedTopic.upsert({
      where: { topicBanned: topicBan },
      update: {},
      create: {
        topicBanned: topicBan,
      },
    });

    await prisma.topic.deleteMany({
      where: {
        titleTopic: topicBan,
      },
    });

    console.log(addTopicBan);
    res.status(200).json(topicBan);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}
