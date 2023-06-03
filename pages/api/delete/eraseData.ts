import { prisma } from '@/lib/db/clients';
import { BannedTopic, Question } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

interface DeleteRecord {
  id?: number;
  name: string;
  ques?: Question[];
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const addQuestion = async (questions: Question[], topicId: number) => {
  const createdQuestions = await Promise.all(
    questions.map(async (question: Question) => {
      const { question: q, correct_answer, options } = question;
      const post = await prisma.question.create({
        data: {
          question: q,
          correct_answer,
          options,
          topicId: topicId,
        },
      });
      return post;
    })
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const request = <DeleteRecord>req.body;

    if (!request) return res.status(400).json({ message: 'Bad Request' });
    let successMessage: string;
    const record = request.name;
    if (record === 'bannedTopic') {
      await prisma.bannedTopic.delete({
        where: {
          id: request.id,
        },
      });
      successMessage = 'Success Delete Banned Topic';
    } else if (record === 'topic') {
      await prisma.topic.delete({
        where: {
          id: request.id,
        },
      });
      successMessage = 'Success Delete Topic';
    } else if (record === 'question') {
      const quests = request.ques;
      const deletedQuestions = await prisma.question.deleteMany({
        where: {
          id: {
            in: quests?.map((question) => question.id),
          },
        },
      });
      const numberOfQuestions = deletedQuestions.count;

      const topicNumber = quests?.[0].topicId;
      const findTopic = await prisma.topic.findUnique({
        where: {
          id: topicNumber,
        },
        select: {
          titleTopic: true,
          level: true,
          questions: true,
        },
      });

      if (findTopic?.questions.length! >= 10) {
        successMessage = 'Success Delete Questions';
      } else {
        const numQuestion =
          numberOfQuestions === 1
            ? `1(one) trivia question`
            : `${numberOfQuestions} trivia questions`;
        const openAiData: ChatCompletionRequestMessage[] = [
          {
            role: 'user',
            content: `Please generate a set of ${numQuestion} on the topic "${findTopic?.titleTopic}" with "${findTopic?.level}" levels of difficulty. Each question should have one correct answer and three incorrect answers, and all options should be randomly shuffled. Format the output as a JSON array with the following structure: [{ "question": "Which currency is used in Japan?", "correct_answer": "Japanese yen", "options": ["Pound sterling", "Euro", "Japanese yen", "Australian dollar"] }]. Please ensure that the correct answer is included in the list of options, that each question is unique, and that the set of questions covers a variety of subtopics related to "${findTopic?.titleTopic}".`,
          },
        ];
        const question = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: openAiData,
        });
        const questions = question.data.choices[0].message?.content || '';
        const parsedQuestions = JSON.parse(questions);

        if (parsedQuestions.length != numberOfQuestions) {
          await addQuestion(
            parsedQuestions.slice(0, numberOfQuestions),
            topicNumber!
          );
        } else {
          await addQuestion(parsedQuestions, topicNumber!);
        }

        successMessage = 'Success Delete Questions';
      }
    } else {
      //error 400
      return res.status(400).json({ message: 'Bad Request' });
    }
    res.status(200).json(successMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}
