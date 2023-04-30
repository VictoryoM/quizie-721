import { prisma } from '@/lib/db/clients';
import { Question } from '@prisma/client';
import { Box, Heading } from '@chakra-ui/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Questions({ questions }: Props) {
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
  const questions = await prisma.question.findMany({
    where: {
      topicId: 1,
    },
  });

  return {
    props: {
      questions,
    },
  };
};
