import {
  Box,
  chakra,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import LeaderScorePage from '../components/LeaderboardList';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db/clients';
import { authOptions } from './api/auth/[...nextauth]';
import { GetServerSidePropsContext } from 'next';
import { TopicResult } from '@prisma/client';
import { LeaderB } from '@/models/scoreboard';
import QuizScoreList from '@/components/QuizScoreList';

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

interface Props {
  leaderboard: LeaderB[];
  topicBoard: TopicResult[];
}

export default function BasicStatistics(props: Props) {
  const { leaderboard, topicBoard } = props;
  //latest score percentage
  const prevScore = topicBoard[0]?.correctNum * 10 || 0;
  //count total attemptNum
  let attemptNumber = 0;
  topicBoard.forEach((topic) => {
    attemptNumber += topic.attemptNum;
  });
  //overall score
  let overallScore = 0;
  leaderboard.map((lead) => {
    lead.userId === topicBoard[0]?.userId && (overallScore += lead.score);
  });
  //average percentage
  let average = 0;
  topicBoard.forEach((topic) => {
    average += topic.average;
  });
  const overallPercentage = Math.round((average / (attemptNumber * 10)) * 100);

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
        {topicBoard.length === 0 ? (
          <Text textAlign={'center'} fontSize={'2xl'} py={10}>
            You have not attempted any quiz yet!
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 8 }}>
            <StatsCard title={'Overall score'} stat={`${overallScore}`} />
            <StatsCard title={'Quizzes attemps'} stat={`${attemptNumber}`} />
            <StatsCard
              title={'Overall Percentage'}
              stat={`${overallPercentage}%`}
            />
            <StatsCard
              title={'Previous quiz percentage'}
              stat={`${prevScore}%`}
            />
          </SimpleGrid>
        )}
      </Box>
      <LeaderScorePage lead={leaderboard} />
      <QuizScoreList stat={topicBoard} />
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
      userId: true,
      user: {
        select: {
          name: true,
        },
      },
      topic: {
        select: {
          titleTopic: true,
        },
      },
    },
  });
  const topicBoard = await prisma.topicResult.findMany({
    where: {
      user: {
        email: session?.user?.email || 'none',
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      userId: true,
      average: true,
      attemptNum: true,
      correctNum: true,
    },
  });

  return {
    props: {
      session,
      topicBoard,
      leaderboard,
    },
  };
}
