import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const question = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: req.body.messages,
    });

    res.status(200).json({ result: question.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}
