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
import { useEffect, useState } from 'react';

export default function TopicLists(props: any) {
  const { topics } = props;
  // const [refresh, setRefresh] = useState(false); // initialize state for refresh

  if (!topics || topics.length === 0)
    return (
      <Box m={[5, 8]}>
        <Center>
          <Heading>No Topics Found</Heading>
        </Center>
      </Box>
    );

  // const handleRefresh = () => {
  //   setRefresh(true); // set the refresh state to true
  //   console.log(refresh);
  // };

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
                  pathname: '/quiz',
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
          {/* <Button onClick={handleRefresh} colorScheme='teal' variant='outline'>
            Refresh
          </Button> */}
        </Stack>
      </Center>
    </Box>
  );
}
