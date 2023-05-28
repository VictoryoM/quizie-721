import {
  Box,
  Center,
  List,
  ListItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import { TopicResult } from '@prisma/client';

interface QuizScoreListProps {
  stat: TopicResult[];
}

export default function QuizScoreList(props: QuizScoreListProps) {
  const { stat } = props;
  console.log(stat);

  const quizScores = [
    { title: 'Quiz 1', score: '80%' },
    { title: 'Quiz 2', score: '60%' },
    { title: 'Quiz 3', score: '70%' },
    { title: 'Quiz 4', score: '45%' },
    { title: 'Quiz 5', score: '92%' },
  ];
  const listItemBgColor = useColorModeValue('gray.100', 'gray.700');
  const listItemHoverBgColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box>
      <Box maxW='7xl' mx='auto' pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        <chakra.h1 textAlign='center' fontSize='4xl' py={10} fontWeight='bold'>
          Your Quiz Scores
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
            {quizScores.map((quizScore) => (
              <ListItem
                key={quizScore.title}
                bg={listItemBgColor}
                _hover={{ bg: listItemHoverBgColor }}
                rounded='md'
                p={4}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <Box fontSize='lg' fontWeight='semibold' mb={2}>
                  {quizScore.title}
                </Box>
                <Stat textAlign={'right'}>
                  <StatLabel>Amount</StatLabel>
                  <StatNumber>{quizScore.score}</StatNumber>
                </Stat>
              </ListItem>
            ))}
          </List>
        </Center>
      </SimpleGrid>
    </Box>
  );
}
