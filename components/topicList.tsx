import { Box, Button, Center, Heading, Tooltip } from '@chakra-ui/react';
import { Topic } from '@prisma/client';
import Link from 'next/link';

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
      mb={10}
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
                id: topic.id,
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
