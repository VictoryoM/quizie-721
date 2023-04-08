import { prisma } from '@/lib/db/clients';
import { Heading } from '@chakra-ui/react';

export default function Questions() {
  return (
    <Heading>Questions</Heading>
    // <div>
    //   {questions.map((question) => (
    //     <div key={question.id}>
    //       <h2>{question.question}</h2>
    //       <p>{question.correct_answer}</p>
    //       <p>{question.options}</p>
    //     </div>
    //   ))}
    // </div>
  );
}

export async function getServerSideProps() {
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
}
