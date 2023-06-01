import { TopicBoard } from '@/models/scoreboard';
import {
  Box,
  Button,
  Center,
  List,
  ListItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function QuizScoreList() {
  const [quizScores, setQuizScores] = useState<TopicBoard[]>([]);
  const [showAverage, setShowAverage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    //make api call to get quiz scores
    const getQuizScores = async () => {
      const res = await fetch('/api/userScore');
      const data = await res.json();
      setQuizScores(data);
    };
    getQuizScores();
  }, []);

  const handleToggleAverage = () => {
    setShowAverage(!showAverage);
  };
  const listItemBgColor = useColorModeValue('gray.100', 'gray.700');
  const listItemHoverBgColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box>
      <Box maxW='7xl' mx='auto' pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        <chakra.h1 textAlign='center' fontSize='4xl' py={8} fontWeight='bold'>
          Your Quiz Scores
        </chakra.h1>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 1 }} spacing={8} mb={8}>
        <Center flexDirection={'column'} gap={2}>
          <Box w='80%' maxW={'750px'} textAlign={'end'}>
            {quizScores.length !== 0 && (
              <Button onClick={handleToggleAverage}>
                {showAverage ? 'Percentage' : 'Score'}
              </Button>
            )}
          </Box>
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
            {quizScores.length === 0 && (
              <Box textAlign={'center'}>
                <Text fontSize={'2xl'} py={10}>
                  You have not attempted any quiz yet!
                </Text>
                <Button onClick={() => router.push('/')}>Lets start!</Button>
              </Box>
            )}
            {quizScores.map((quizScore) => (
              <ListItem
                key={quizScore.topic.titleTopic}
                bg={listItemBgColor}
                _hover={{ bg: listItemHoverBgColor }}
                rounded='md'
                p={4}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <Box fontSize='lg' fontWeight='semibold' mb={2}>
                  {quizScore.topic.titleTopic}
                  <Text
                    fontSize={'sm'}
                    fontWeight={'semibold'}
                    color={'gray'}
                    fontStyle={'italic'}
                  >
                    Attempts: {quizScore.attemptNum}
                  </Text>
                </Box>
                <Stat textAlign={'right'}>
                  <StatLabel>
                    {showAverage ? 'Overall Score' : 'Average'}
                  </StatLabel>
                  <StatNumber>
                    {showAverage
                      ? `${quizScore.average}/${quizScore.attemptNum * 10}`
                      : `${(
                          (quizScore.average / (quizScore.attemptNum * 10)) *
                          100
                        ).toFixed()}%`}
                  </StatNumber>
                </Stat>
              </ListItem>
            ))}
          </List>
        </Center>
      </SimpleGrid>
    </Box>
  );
}
