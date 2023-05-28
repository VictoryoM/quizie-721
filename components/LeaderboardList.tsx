import {
  Box,
  Center,
  Flex,
  List,
  ListItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import QuizScoreList from './QuizScoreList';
import { LeaderB, Scores } from '@/models/scoreboard';

interface Props {
  lead: LeaderB[];
}

export default function LeaderScorePage(props: Props) {
  const { lead } = props;
  const listItemBgColor = useColorModeValue('gray.100', 'gray.700');
  const listItemHoverBgColor = useColorModeValue('gray.200', 'gray.600');
  const scoresByUserId: Scores[] = [];
  for (const item of lead) {
    const { score, userId, user, topic } = item;

    const existingItem = scoresByUserId.find((s) => s.userId === userId);
    if (existingItem) {
      existingItem.totalScore += score;
      existingItem.topicTitles.push(topic.titleTopic);
    } else {
      scoresByUserId.push({
        userId,
        userName: user.name,
        topicTitles: [topic.titleTopic],
        totalScore: score,
      });
    }
  }
  scoresByUserId.sort((a, b) => b.totalScore - a.totalScore);

  return (
    <>
      <Box maxW='7xl' mx='auto' pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        <chakra.h1 textAlign='center' fontSize='4xl' py={10} fontWeight='bold'>
          Leaderboard
        </chakra.h1>
      </Box>

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
            {scoresByUserId.map((quizScore) => (
              <ListItem
                key={quizScore.userId}
                bg={listItemBgColor}
                _hover={{ bg: listItemHoverBgColor }}
                rounded='md'
                p={4}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <Box fontSize='lg' fontWeight='semibold' mb={2}>
                  {quizScore.userName}
                  <Tooltip
                    label={`${quizScore.topicTitles.join(', ')}`}
                    openDelay={500}
                    hasArrow
                  >
                    <Flex
                      fontSize={'xs'}
                      fontStyle={'oblique'}
                      fontWeight={'semibold'}
                      color={'gray.500'}
                    >
                      Quizzes:{' '}
                      {quizScore.topicTitles
                        .map((title) => title)
                        .slice(0, 2)
                        .join(', ')}
                      {quizScore.topicTitles.length > 2
                        ? ` + ${quizScore.topicTitles.length - 2} more`
                        : ''}
                    </Flex>
                  </Tooltip>
                </Box>
                <Stat textAlign={'right'}>
                  <StatLabel>Total Score</StatLabel>
                  <StatNumber>{quizScore.totalScore}</StatNumber>
                </Stat>
              </ListItem>
            ))}
          </List>
        </Center>
      </SimpleGrid>
    </>
  );
}
