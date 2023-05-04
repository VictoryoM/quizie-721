import type { InferGetServerSidePropsType } from 'next';
import { prisma } from '@/lib/db/clients';
import type { TopicResult } from '@prisma/client';
import {
  Center,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

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
      <Tabs variant={'soft-rounded'} colorScheme='green' isFitted my={10}>
        <TabList>
          {questions.map((question, index) => (
            <Tab key={index}>{`Q ${index + 1}`}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {questions.map((question, index) => (
            <TabPanel key={index}>
              <Box mx={['5%', 'auto']} w={['90%', '70%']} mt={10}>
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
              </Box>


            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <Center>
        <Button onClick={submitHandler} mt={8} w="20%" colorScheme="green" >
          Submit
        </Button>
      </Center>

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
