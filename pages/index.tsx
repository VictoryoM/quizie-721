import InputQuestion from '@/components/inputQuestion';
import Questions from '@/components/questionsList';
import UserSignIn from '@/components/signinButton';
import Head from 'next/head';
import Trial from './quiz';
import { useSession, signIn, signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { prisma } from '@/lib/db/clients';
import TopicLists from '@/components/topicList';
import { Center, Divider } from '@chakra-ui/react';
import TrendingTopics from '@/components/dashboard/TrendingTopics';

export default function Home({ topics }: any) {
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
      <TopicLists topics={topics} />
      <TrendingTopics />
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const topics = await prisma.topic.findMany();

  return {
    props: {
      session,
      topics: JSON.parse(JSON.stringify(topics)),
    },
  };
}
