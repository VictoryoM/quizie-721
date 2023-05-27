import {
  Box,
  Center,
  Heading,
  List,
  ListItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import QuizScoreList from '../QuizScoreList';
import { Topic } from '@prisma/client';

interface Props {
  topics: Topic[];
}

const TrendingTopics = (props: Props) => {
  const { topics } = props;
  const listItemBgColor = useColorModeValue('gray.100', 'gray.700');
  const listItemHoverBgColor = useColorModeValue('gray.200', 'gray.600');
  //take 3 from topics
  const trendingTopics = topics.slice(0, 5);
  const quizScores = [
    { title: 'Topic 1', score: '80' },
    { title: 'Topic 2', score: '95' },
    { title: 'Topic 3', score: '70' },
  ];

  return (
    <div>
      <Box mb={'20'}>
        <Heading textAlign={'center'} mb={'4'}>
          Trending Topics
        </Heading>
        <Box>
          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={8} mb={8}>
            <Center>
              <List
                spacing={3}
                w='80%'
                maxW={'750px'}
                overflowY={'scroll'}
                maxH={'400px'}
                style={
                  {
                    scrollbarWidth: 'none',
                    overflow: '-moz-scrollbars-none',
                    msOverflowStyle: 'none',
                  } as React.CSSProperties
                }
              >
                {trendingTopics.map((quizScore: any) => (
                  <ListItem
                    key={quizScore.id}
                    bg={listItemBgColor}
                    _hover={{ bg: listItemHoverBgColor }}
                    rounded='md'
                    p={4}
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Box fontSize='lg' fontWeight='semibold' mb={2}>
                      {quizScore.titleTopic}
                      <Text
                        fontSize={'xs'}
                        fontStyle={'italic'}
                        fontWeight={'semibold'}
                        color={'gray.500'}
                      >
                        {quizScore.level} - {quizScore.quizMaster.name}
                      </Text>
                    </Box>
                    <Stat textAlign={'right'}>
                      <StatLabel>Quiz Takers</StatLabel>
                      <StatNumber mr={6}>{quizScore.timesTaken}</StatNumber>
                    </Stat>
                  </ListItem>
                ))}
              </List>
            </Center>
          </SimpleGrid>
        </Box>
      </Box>
    </div>
  );
};

export default TrendingTopics;
