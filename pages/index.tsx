import InputQuestion from '@/components/inputQuestion';
import Head from 'next/head';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { prisma } from '@/lib/db/clients';
import TopicLists from '@/components/topicList';
import { Center, Divider, Flex } from '@chakra-ui/react';
import TrendingTopics from '@/components/dashboard/TrendingTopics';
import { GetServerSidePropsContext } from 'next';
import { Topic } from '@prisma/client';

interface Props {
  topics: Topic[];
}

export default function Home(props: Props) {
  const { topics } = props;
  console.log(topics);
  // const { data: session } = useSession();
  // console.log(topics);
  return (
    <>
      <Head>
        <title>Quizie Application</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <InputQuestion />
      {/* <Questions /> */}
      {/* <UserSignIn user={session?.user} onSignIn={signIn} onSignOut={signOut} /> */}
      <Center m={[2, 3]} height='50px'>
        <Divider orientation='vertical' />
      </Center>
      <Flex direction={'column'} gap={6}>
        <TopicLists topics={topics} />
        <TrendingTopics topics={topics} />
      </Flex>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const topics = await prisma.topic.findMany({
    orderBy: {
      timesTaken: 'desc',
    },
    select: {
      titleTopic: true,
      timesTaken: true,
      id: true,
      level: true,
      quizMaster: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    props: {
      session,
      topics,
    },
  };
}
