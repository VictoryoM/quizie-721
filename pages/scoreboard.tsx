import {
  Box,
  chakra,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';
import QuizScorePage, { LeaderScorePage } from '../components/QuizScorePage';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db/clients';
import { authOptions } from './api/auth/[...nextauth]';
import { GetServerSidePropsContext } from 'next';
import { TopicResult } from '@prisma/client';

interface StatsCardProps {
  title: string;
  stat: string;
}
function StatsCard(props: StatsCardProps) {
  const { title, stat } = props;
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.400', 'gray.500')}
      rounded={'lg'}
    >
      <StatLabel fontWeight={'medium'} isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
        {stat}
      </StatNumber>
    </Stat>
  );
}

interface LeaderB {
  score: number;
  user: {
    name: string;
  };
}

interface Props {
  leaderboard: LeaderB[];
  topicBoard: TopicResult[];
}

export default function BasicStatistics(props: Props) {
  const { leaderboard, topicBoard } = props;
  return (
    <>
      <Box maxW='7xl' mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        <chakra.h1
          textAlign={'center'}
          fontSize={'4xl'}
          py={10}
          fontWeight={'bold'}
        >
          How well are you doing?
        </chakra.h1>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
          <StatsCard title={'Overall score'} stat={'60%'} />
          <StatsCard title={'Attempted quizzes'} stat={'30'} />
          <StatsCard
            title={'Previous quiz score'}
            stat={`${topicBoard[0].correctNum * 10}%`}
          />
        </SimpleGrid>
      </Box>
      <LeaderScorePage />
      <QuizScorePage />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  // const topics = await prisma.topic.findMany();
  const leaderboard = await prisma.leaderboard.findMany({
    orderBy: {
      score: 'desc',
    },
    select: {
      score: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  const topicBoard = await prisma.topicResult.findMany({
    where: {
      user: {
        email: session?.user?.email,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      average: true,
      attemptNum: true,
      correctNum: true,
    },
  });
  console.log(leaderboard);
  console.log(topicBoard);

  // const topics = await prisma.topic.findMany();
  // //take 5 trending topics from topics
  // const trendingTopics = topics.sort((a, b) => {
  //   return b.timesTaken - a.timesTaken;
  // });
  // trendingTopics.splice(5);
  // console.log(trendingTopics);

  return {
    props: {
      session,
      topicBoard,
      leaderboard,
    },
  };
}
