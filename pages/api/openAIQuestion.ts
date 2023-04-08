import { prisma } from '@/lib/db/clients';
import { Question, Topic } from '@prisma/client';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

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
    console.log(req.body);
    const topic = req.body.messages.topic;
    const level = req.body.messages.questions;
    if (!topic || topic === '') throw new Error('Topic is required');

    // const openAiData: ChatCompletionRequestMessage[] = [
    //   {
    //     role: 'user',
    //     content: `Please generate a set of 10 trivia questions on the topic "${topic}" with "${level}" levels of difficulty. Each question should have one correct answer and three incorrect answers, and all options should be randomly shuffled. Format the output as a JSON array with the following structure: [{ "question": "What is the capital of France?", "correct_answer": "Paris", "options": [ "Tokyo", "London", "Paris", "New York" ] }]. Please ensure that the correct answer is included in the list of options, that each question is unique, and that the set of questions covers a variety of subtopics related to "${topic}".`,
    //   },
    // ];

    // const createQuiz = await prisma.topic.upsert({
    //   where: { titleTopic_level: { titleTopic: topic, level: level } },
    //   create: { titleTopic: topic, level: level },
    //   update: {},
    // });

    let createQuiz = await prisma.topic.findFirst({
      where: {
        titleTopic: topic,
        level: level,
      },
    });
    if (!createQuiz) {
      createQuiz = await prisma.topic.create({
        data: {
          titleTopic: topic,
          level: level,
        },
      });
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
        res.status(200).json({ result: question.data });
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
        res.status(200).json({ result: question.data });
        const replies = question.data.choices[0].message?.content;
        let questions: Question[] = [];

        const topicId = createQuiz.id;
        if (replies !== '') {
          questions = JSON.parse(replies ?? '');
          addQuestion(questions, topicId);
        }
      } else if (findQuestions.length === 10) {
        res.status(200).json({ result: findQuestions });
        console.log(`\n\nVICTORYO\n\n${JSON.stringify(findQuestions)}\n\n}`);
      }
    }

    // console.log(`\n\nVICTORYO\n\n${JSON.stringify(createQuiz)}\n\n}`);
    // const topicId = createQuiz.id;
    // const question = await openai.createChatCompletion({
    //   model: 'gpt-3.5-turbo',
    //   messages: openAiData,
    // });
    // console.log(question);
    // res.status(200).json({ result: question.data });
    // const replies = question.data.choices[0].message?.content;
    // console.log(replies);
    // let questions: Question[] = [];

    // if (replies !== '') {
    //   questions = JSON.parse(replies ?? '');
    //   addQuestion(questions, topicId);
    // }
    // console.log(question.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}
