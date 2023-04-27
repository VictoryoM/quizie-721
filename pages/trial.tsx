import type { InferGetServerSidePropsType } from 'next';
import { prisma } from '@/lib/db/clients';
import {
  Box,
  ListItem,
  OrderedList,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function Trial({
  questions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // console.log(questions);
  const [value, setValue] = useState('');
  console.log(value);
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
              <RadioGroup onChange={setValue} value={value}>
                <Stack>
                  <Radio
                    value={`{pickedAnswer: ${question.options[0]}, questionId: ${question.id}}`}
                  >
                    {question.options[0]}
                  </Radio>
                  <Radio
                    value={`{pickedAnswer: ${question.options[1]}, questionId: ${question.id}}`}
                  >
                    {question.options[1]}
                  </Radio>
                  <Radio
                    value={`{pickedAnswer: ${question.options[2]}, questionId: ${question.id}}`}
                  >
                    {question.options[2]}
                  </Radio>
                  <Radio
                    value={`{pickedAnswer: ${question.options[3]}, questionId: ${question.id}}`}
                  >
                    {question.options[3]}
                  </Radio>
                </Stack>
              </RadioGroup>
            </ListItem>
          ))}
        </OrderedList>
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
