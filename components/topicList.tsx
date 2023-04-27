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
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

export default function TopicLists(props: any) {
  const { topics } = props;
  console.log(topics);

  if (!topics || topics.length === 0)
    return (
      <Box m={[5, 8]}>
        <Center>
          <Heading>No Topics Found</Heading>
        </Center>
      </Box>
    );

  return (
    <Box m={[5, 8]}>
      <Center>
        <Stack direction='row' spacing={4} align='center'>
          {topics.map((topic: any) => (
            <Tooltip
              key={topic.id}
              label={topic.level}
              aria-label={topic.titleTopic}
            >
              <Link
                href={{
                  pathname: '/trial',
                  query: {
                    titleTopic: `${topic.titleTopic}`,
                    level: `${topic.level}`,
                  },
                }}
              >
                <Button colorScheme='teal' variant='outline'>
                  {topic.titleTopic}
                </Button>
              </Link>
            </Tooltip>
          ))}
        </Stack>
      </Center>
    </Box>
  );
}
