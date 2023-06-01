import { Box, Button, Center, Heading, Tooltip } from '@chakra-ui/react';
import { Topic } from '@prisma/client';
import Link from 'next/link';
import { AES } from 'crypto-js';

interface Pass {
  titleTopic: string;
  level: string;
  id: number;
}

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
  const encryptQueryParams = (params: Pass) => {
    const encryptedParams = AES.encrypt(
      JSON.stringify(params),
      process.env.QUIZ_SECRET!
    ).toString();
    return encryptedParams;
  };

  return (
    <Box
      maxWidth={'100%'}
      display='flex'
      justifyContent={['center']}
      flexWrap='wrap'
      mb={10}
    >
      {topics.map((topic: Topic, index: number) => {
        const queryParams = {
          titleTopic: topic.titleTopic,
          level: topic.level,
          id: topic.id,
        };

        const encryptedQueryParams = encryptQueryParams(queryParams);

        return (
          <Tooltip
            key={topic.id}
            label={topic.level}
            aria-label={topic.titleTopic}
          >
            <Link
              href={{
                pathname: '/quiz',
                query: { data: encryptedQueryParams },
              }}
              suppressHydrationWarning
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
        );
      })}
    </Box>
  );
}
