import Questions from '@/components/questionsList';
import { prisma } from '@/lib/db/clients';
import { Box, Heading } from '@chakra-ui/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React from 'react';

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Page({ questions }: Props) {
  return (
    <Box>
      <Heading>Questions</Heading>
      {/* <div>
        {questions?.map((question) => (
          <div key={question.id}>
            <h2>{question.question}</h2>
            <p>{question.correct_answer}</p>
            <p>{question.options}</p>
          </div>
        ))}
      </div> */}
      {questions?.question}
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const questions = await prisma.question.findFirst({
    where: {
      topicId: 3,
    },
  });

  return {
    props: {
      questions,
    },
  };
};
