import { prisma } from '@/lib/db/clients';
import { Question, Topic } from '@prisma/client';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { authOptions } from './auth/[...nextauth]';

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
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });
  try {
    console.log(req.body);
    const topicReq = req.body.messages.topic;
    const level = req.body.messages.questions;
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user?.email! },
    });
    if (!prismaUser) {
      res.status(401).json({ message: 'Unauthorized' });
    }
    if (!topicReq || topicReq === '' || topicReq.length < 3) {
      res.status(400).json({ message: 'Topic is required' });
    }

    const words = topicReq.toLowerCase().split(' ');
    const capitalizedWords = words.map(
      (word: String) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    const topic = capitalizedWords.join(' ');

    let createQuiz = await prisma.topic.findFirst({
      where: {
        titleTopic: topic,
        level: level,
        quizMasterId: prismaUser!.id,
      },
    });
    if (!createQuiz && topic.length >= 3 && level.length !== 0) {
      //check if it is a banned topic
      const bannedTopic = await prisma.bannedTopic.findFirst({
        where: {
          topicBanned: topic,
        },
      });
      if (bannedTopic) {
        res.status(400).json({ message: 'Topic is banned' });
      }
      createQuiz = await prisma.topic.create({
        data: {
          titleTopic: topic,
          level: level,
          quizMasterId: prismaUser!.id,
        },
      });
      const roleCheck = await prisma.role.findFirst({
        where: {
          users: {
            some: {
              email: prismaUser?.email,
            },
          },
        },
      });
      if (!roleCheck) {
        const assignRole = await prisma.role.update({
          where: {
            name: 'QuizAdmin',
          },
          data: {
            users: {
              connect: {
                id: prismaUser!.id,
              },
            },
          },
        });
      }
      const findQuestions = await prisma.question.findMany({
        where: {
          topicId: createQuiz.id,
        },
      });
      if (findQuestions.length < 10 || findQuestions.length === 0) {
        const numQuestion =
          findQuestions.length === 9
            ? `1(one) trivia question`
            : `${10 - findQuestions.length} trivia questions`;
        const openAiData: ChatCompletionRequestMessage[] = [
          {
            role: 'user',
            content: `Please generate a set of ${numQuestion} on the topic "${topic}" with "${level}" levels of difficulty. Each question should have one correct answer and three incorrect answers, and all options should be randomly shuffled. Format the output as a JSON array with the following structure: [{ "question": "What is the capital of France?", "correct_answer": "Paris", "options": [ "Tokyo", "London", "Paris", "New York" ] }]. Please ensure that the correct answer is included in the list of options, that each question is unique, and that the set of questions covers a variety of subtopics related to "${topic}".`,
          },
        ];
        const question = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: openAiData,
        });
        res.status(200).json('Success Create Topic');
        // res.status(200).json({ result: question.data });
        const replies = question.data.choices[0].message?.content;
        let questions: Question[] = [];

        const topicId = createQuiz.id;
        if (replies !== '') {
          questions = JSON.parse(replies ?? '');
          addQuestion(questions, topicId);
        }
      }
    } else if (createQuiz) {
      // make questions
      const findQuestions = await prisma.question.findMany({
        where: {
          topicId: createQuiz.id,
        },
      });
      if (findQuestions.length < 10) {
        const numQuestion =
          findQuestions.length === 9
            ? `1(one) trivia question`
            : `${10 - findQuestions.length} trivia questions`;
        const openAiData: ChatCompletionRequestMessage[] = [
          {
            role: 'user',
            content: `Please generate a set of ${numQuestion} on the topic "${topic}" with "${level}" levels of difficulty. Each question should have one correct answer and three incorrect answers, and all options should be randomly shuffled. Format the output as a JSON array with the following structure: [{ "question": "What is the capital of France?", "correct_answer": "Paris", "options": [ "Tokyo", "London", "Paris", "New York" ] }]. Please ensure that the correct answer is included in the list of options, that each question is unique, and that the set of questions covers a variety of subtopics related to "${topic}".`,
          },
        ];
        const question = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: openAiData,
        });
        res.status(200).json('Topic has existed and Success Create Question');
        // res.status(200).json({ result: question.data });
        const replies = question.data.choices[0].message?.content;
        let questions: Question[] = [];

        const topicId = createQuiz.id;
        if (replies !== '') {
          questions = JSON.parse(replies ?? '');
          addQuestion(questions, topicId);
        }
      } else if (findQuestions.length === 10) {
        res.status(200).json('Topic has existed in your database');
        // res.status(200).json({ result: findQuestions });
        // console.log(`\n\nVICTORYO\n\n${JSON.stringify(findQuestions)}\n\n}`);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}
