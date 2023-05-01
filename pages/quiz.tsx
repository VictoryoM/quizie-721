import type { InferGetServerSidePropsType } from 'next';
import { prisma } from '@/lib/db/clients';
import type { TopicResult } from '@prisma/client';
import {
  Box,
  Button,
  ListItem,
  OrderedList,
  Radio,
  RadioGroup,
  Stack,
  Text,
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
    const { average, attemptNum }: TopicResult = await response.json();
    console.log(average);
    const percentage = (average / (attemptNum * 10)) * 100;
    console.log(`${percentage}%`);

    // setAnswers([]);
  };

  const setValue = (event: any) => {
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
  <Box w={['100%', '80%']} mt={'50px'} mx={'auto'} mb={'200px'}>
    <OrderedList spacing={4}>
      {questions.map((question) => (
        <ListItem key={question.id} py={4}>
          <Text fontSize={['md', 'lg']} fontWeight="bold">
            {question.question}
          </Text>
          <RadioGroup onChange={setValue} mt={4}>
            <Stack spacing={2}>
              {question.options.map((option, index) => (
                <Radio
                  key={index}
                  value={JSON.stringify({
                    pickedAnswer: option,
                    questionId: question.id,
                  })}
                >
                  <Text fontSize={['md', 'lg']}>{option}</Text>
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </ListItem>
      ))}
    </OrderedList>
    <Button onClick={submitHandler} mt={8} w="100%" colorScheme="blue">
      Submit
    </Button>
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
