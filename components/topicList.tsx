import { prisma } from '@/lib/db/clients';
import {
  Box,
  Button,
  Center,
  Heading,
  ListItem,
  OrderedList,
  Stack,
  Tooltip,
} from '@chakra-ui/react';
import { Topic } from '@prisma/client';
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TopicLists(props: any) {
  const { topics } = props;

  if (!topics || topics.length === 0)
    return (
      <Box m={[5, 8]}>
        <Center>
          <Heading>No Topics Found</Heading>
        </Center>
      </Box>
    );

  return (
    <Box
      maxWidth={'100%'}
      display='flex'
      justifyContent={['center']}
      flexWrap='wrap'
    >
      {topics.map((topic: Topic, index: number) => (
        <Tooltip
          key={topic.id}
          label={topic.level}
          aria-label={topic.titleTopic}
        >
          <Link
            href={{
              pathname: '/quiz',
              query: {
                titleTopic: `${topic.titleTopic}`,
                level: `${topic.level}`,
              },
            }}
          >
            <Button
              colorScheme={
                ['red', 'blue', 'green', 'purple', 'pink'][index % 5]
              }
              variant='outline'
              my={[1, 2]}
              mx={[1, 2]}
            >
              {topic.titleTopic}
            </Button>
          </Link>
        </Tooltip>
      ))}
    </Box>
  );
}
