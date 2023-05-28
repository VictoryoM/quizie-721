import React from 'react';
import SimpleSidebar from '../components/dashboard/sidebarDashboard';
import HomeStatistics from '../components/dashboard/HomeStat';
import BanTopics from '@/components/dashboard/BanTopics';
import Settings from '@/components/dashboard/Settings';
import RemoveTopic from '@/components/dashboard/RemoveTopic';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db/clients';
import { authOptions } from './api/auth/[...nextauth]';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { Box } from '@chakra-ui/react';
import { QuizMaster } from '@/models/dashboard';

export default function Dashboard({
  findUser,
  bannedTopics,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <SimpleSidebar role={role}>
        <Box id='home'>
          <HomeStatistics role={role || 'Normal User'} topics={findUser} />
        </Box>
        {role === 'Admin' || role === 'QuizAdmin' ? (
          <Box id='remove-topics'>
            <RemoveTopic topics={findUser} />
          </Box>
        ) : null}
        <Box>
          {role === 'Admin' ? (
            <Box id='ban-topics' display={role === 'Admin' ? 'block' : 'none'}>
              <BanTopics banTopic={bannedTopics} />
            </Box>
          ) : null}
          <Box id='settings'>
            <Settings />
          </Box>
        </Box>
      </SimpleSidebar>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const role = (await prisma.role.findFirst({
    where: {
      users: {
        some: {
          email: session?.user?.email || 'none',
        },
      },
    },
    select: {
      name: true,
    },
  })) || { name: 'Normal User' };
  if (role.name === 'Admin') {
    const findUser: QuizMaster[] = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        topics: {
          select: {
            id: true,
            titleTopic: true,
            level: true,
            timesTaken: true,
          },
        },
        topicResults: {
          select: {
            attemptNum: true,
            average: true,
            updatedAt: true,
          },
        },
      },
    });

    // findUser.forEach((user) => {
    //   console.log(user.topics); // Accessing quizMaster for each element
    // });
    const bannedTopics = await prisma.bannedTopic.findMany();
    return {
      props: {
        session,
        bannedTopics: JSON.parse(JSON.stringify(bannedTopics)),
        findUser: JSON.parse(JSON.stringify(findUser)),
        role: role.name,
      },
    };
  }
  const findUser: QuizMaster[] = await prisma.user.findMany({
    where: {
      email: session?.user?.email,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      topicResults: {
        select: {
          attemptNum: true,
          average: true,
          updatedAt: true,
        },
      },
      topics: {
        select: {
          id: true,
          titleTopic: true,
          level: true,
          timesTaken: true,
        },
      },
    },
  });

  return {
    props: {
      session,
      findUser: JSON.parse(JSON.stringify(findUser)),
      role: role.name,
    },
  };
}
