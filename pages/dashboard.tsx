import React, { use } from 'react';
import SimpleSidebar from '../components/dashboard/sidebarDashboard';
import HomeStatistics from '../components/dashboard/HomeStat';
import TrendingTopics from '@/components/dashboard/TrendingTopics';
import BanTopics from '@/components/dashboard/BanTopics';
import Settings from '@/components/dashboard/Settings';
import RemoveTopic from '@/components/dashboard/RemoveTopic';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db/clients';
import { authOptions } from './api/auth/[...nextauth]';
import { InferGetServerSidePropsType } from 'next';
import { Box } from '@chakra-ui/react';

export default function Dashboard({
  topics,
  topicsTakenUser,
  scoreUser,
  numberOfUsers,
  todaysUsers,
  topicsTakenOverall,
  role,
  topicsAttemptUser,
  findUser,
  bannedTopics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('role', role);
  return (
    <>
      <SimpleSidebar>
        <Box id='home'>
          <HomeStatistics
            role={role || 'Normal User'}
            topicsTakenUser={topicsTakenUser || 0}
            scoreUser={scoreUser || 0}
            numberOfUsers={numberOfUsers || 0}
            todaysUsers={todaysUsers || 0}
            topicsTakenOverall={topicsTakenOverall || 0}
            topicsAttemptUser={topicsAttemptUser || 0}
          />
        </Box>
        {/* <div id='trending-topics'>
          <TrendingTopics />
        </div> */}
        <Box id='remove-topics' display={role === 'Admin' ? 'block' : 'none'}>
          <RemoveTopic topics={topics} users={findUser} />
        </Box>
        <Box id='ban-topics' display={role === 'Admin' ? 'block' : 'none'}>
          <BanTopics banTopic={bannedTopics} />
        </Box>
        <Box id='settings'>
          <Settings />
        </Box>
      </SimpleSidebar>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const roleCheck = await prisma.role.findFirst({
    where: {
      users: {
        some: {
          email: session?.user?.email,
        },
      },
    },
  });
  const role = roleCheck?.name;
  // Normal User
  const topicResults = await prisma.topicResult.findMany({
    where: {
      user: {
        email: session?.user?.email,
      },
    },
  });
  let topicsTakenUser = 0;
  let topicsAttemptUser = 0;
  let scoreUser = 0;
  topicResults.forEach((topic) => {
    topicsAttemptUser += topic.attemptNum;
    scoreUser += topic.average;
    topicsTakenUser += 1;
  });
  // QuizAdmin
  if (roleCheck?.name === 'QuizAdmin') {
    const topics = await prisma.topic.findMany();
    const findUser = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });
    const findTopic = topics.filter((topic) => {
      return topic.quizMasterId === findUser?.id;
    });

    return {
      props: {
        session,
        topics: JSON.parse(JSON.stringify(findTopic)),
        topicsTakenUser,
        scoreUser,
        role,
        topicsAttemptUser,
      },
    };
  }
  // Admin
  if (roleCheck?.name === 'Admin') {
    const topics = await prisma.topic.findMany();
    const findUser = await prisma.user.findMany();
    const numberOfUsers = findUser.length;
    const bannedTopics = await prisma.bannedTopic.findMany();
    const todaysUsers = findUser.filter((user) => {
      const today = new Date();
      const date = new Date(user.createdAt);
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).length;
    let topicsTakenOverall = 0;
    topics.forEach((topic) => {
      topicsTakenOverall += topic.timesTaken;
    });

    return {
      props: {
        session,
        topics: JSON.parse(JSON.stringify(topics)),
        numberOfUsers,
        todaysUsers,
        topicsTakenUser,
        scoreUser,
        topicsTakenOverall,
        role,
        topicsAttemptUser,
        findUser: JSON.parse(JSON.stringify(findUser)),
        bannedTopics: JSON.parse(JSON.stringify(bannedTopics)),
      },
    };
  }

  return {
    props: {
      session,
      topicsTakenUser,
      scoreUser,
      role,
      topicsAttemptUser,
    },
  };
}
