import type { InferGetServerSidePropsType } from 'next';
import { prisma } from '@/lib/db/clients';
import type { TopicResult } from '@prisma/client'
import {
  Box,
  Button,
  ListItem,
  OrderedList,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function Quiz({
  questions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // console.log(questions);
  // const [value, setValue] = useState('');
  // console.log(value);

  const [answers, setAnswers] = useState<{ id: number; answer: string }[]>([]);
  console.log(answers);

  const submitHandler = async () => {
    console.log(answers);
    const response = await fetch('/api/quizScore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: answers }),
    });
    const {average, attemptNum}: TopicResult = (await response.json())
    const percentage = (average / (attemptNum*10)) * 100
    console.log(`${percentage}%`);
    
    // setAnswers([]);
  };

  const setValue = (event: any) => {
    // console.log(event);
    const value = event;
    const answer = JSON.parse(value); // Parse the string value into an object
    const answeredQuestion = answers.find((q) => q.id === answer.questionId);

    if (answeredQuestion) {
      // If the question is already answered, update the answer
      const updatedAnswers = answers.map((q) => {
        if (q.id === answer.questionId) {
          return { id: answer.questionId, answer: answer.pickedAnswer };
        } else {
          return q;
        }
      });

      setAnswers(updatedAnswers);
    } else {
      // If the question is not answered, add the new answer
      const newAnswer = { id: answer.questionId, answer: answer.pickedAnswer };
      setAnswers([...answers, newAnswer]);
    }
  };

  return (
    <>
      {/* {Object.values(questions).map((question) => (
        <div key={question.id}>{question.question}</div>
      ))} */}
      <Box>
        <OrderedList>
          {questions.map((question) => (
            <ListItem key={question.id}>
              {question.question}
              <RadioGroup onChange={setValue}>
                <Stack>
                  <Radio
                    value={JSON.stringify({
                      pickedAnswer: question.options[0],
                      questionId: question.id,
                    })}
                  >
                    {question.options[0]}
                  </Radio>
                  <Radio
                    value={JSON.stringify({
                      pickedAnswer: question.options[1],
                      questionId: question.id,
                    })}
                  >
                    {question.options[1]}
                  </Radio>
                  <Radio
                    value={JSON.stringify({
                      pickedAnswer: question.options[2],
                      questionId: question.id,
                    })}
                  >
                    {question.options[2]}
                  </Radio>
                  <Radio
                    value={JSON.stringify({
                      pickedAnswer: question.options[3],
                      questionId: question.id,
                    })}
                  >
                    {question.options[3]}
                  </Radio>
                </Stack>
              </RadioGroup>
            </ListItem>
          ))}
        </OrderedList>
        <Button onClick={submitHandler}>Submit</Button>
      </Box>
    </>
  );
}

export async function getServerSideProps(titleTopic: any) {
  const topic = titleTopic.query.titleTopic;
  const level = titleTopic.query.level;
  if (!topic || !level) {
    return {
      notFound: true,
    };
  }
  const findTopicId = await prisma.topic.findFirst({
    where: {
      titleTopic: topic,
      level: level,
    },
  });
  // if (!findTopicId) {
  //   Router.replace(Router.asPath);
  // }
  const questions = await prisma.question.findMany({
    where: {
      topicId: findTopicId![`id`],
    },
  });

  return {
    props: { questions },
  };
}
