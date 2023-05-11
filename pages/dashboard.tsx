import React from 'react';
import SimpleSidebar from '../components/dashboard/sidebarDashboard';
import HomeStatistics from '../components/dashboard/HomeStat';
import TrendingTopics from '@/components/dashboard/TrendingTopics';
import BanTopics from '@/components/dashboard/BanTopics';
import Settings from '@/components/dashboard/Settings';
import RemoveTopic from '@/components/dashboard/RemoveTopic';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db/clients';
import { authOptions } from './api/auth/[...nextauth]';

export default function Dashboard() {
  return (
    <>
      <SimpleSidebar>
        <div id='home'>
          <HomeStatistics />
        </div>
        <div id='trending-topics'>
          <TrendingTopics />
        </div>
        <div id='remove-topics'>
          <RemoveTopic />
        </div>
        <div id='ban-topics'>
          <BanTopics />
        </div>
        <div id='settings'>
          <Settings />
        </div>
      </SimpleSidebar>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const topics = await prisma.topic.findMany();
  const findUser = await prisma.user.findMany();
  const user = findUser.find((user) => user.email === session?.user?.email);
  const topicResults = await prisma.topicResult.findMany({
    where: {
      userId: user?.id,
    },
  });
  const numberOfUsers = findUser.length;
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
  let topicsTakenUser = 0;
  let scoreUser = 0;
  topicResults.forEach((topic) => {
    topicsTakenUser += topic.attemptNum;
    scoreUser += topic.average;
  });
  topics.forEach((topic) => {
    topicsTakenOverall += topic.timesTaken;
  });
  const todayTopicAttemptsUser = topicResults.filter((topic) => {
    const today = new Date();
    const date = new Date(topic.createdAt);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }).length;
  //For User View
  console.log('scoreUser', scoreUser);
  console.log('todayTopicAttemptsUser', todayTopicAttemptsUser);
  console.log('topicsTakenUser', topicsTakenUser);
  //For Admin View
  console.log('numberOfUsers', numberOfUsers);
  console.log('todaysUsers', todaysUsers);
  console.log('topicsTaken', topicsTakenOverall);

  return {
    props: {
      session,
      topics: JSON.parse(JSON.stringify(topics)),
    },
  };
}
