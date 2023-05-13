import { Box, chakra } from '@chakra-ui/react';
import QuizScoreList from './QuizScoreList';

export default function QuizScorePage() {
  const quizScores = [
    { title: 'Quiz 1', score: '80%' },
    { title: 'Quiz 2', score: '60%' },
    { title: 'Quiz 3', score: '70%' },
    { title: 'Quiz 4', score: '45%' },
    { title: 'Quiz 5', score: '92%' },
  ];

  return (
    <>
      <Box maxW='7xl' mx='auto' pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        <chakra.h1 textAlign='center' fontSize='4xl' py={10} fontWeight='bold'>
          Your Quiz Scores
        </chakra.h1>
      </Box>

      <QuizScoreList quizScores={quizScores} />
    </>
  );
}
export function LeaderScorePage() {
  const quizScores = [
    { title: 'Quiz 1', score: '80%' },
    { title: 'Quiz 2', score: '60%' },
    { title: 'Quiz 3', score: '70%' },
    { title: 'Quiz 4', score: '45%' },
    { title: 'Quiz 5', score: '92%' },
  ];

  return (
    <>
      <Box maxW='7xl' mx='auto' pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        <chakra.h1 textAlign='center' fontSize='4xl' py={10} fontWeight='bold'>
          Leaderboard
        </chakra.h1>
      </Box>

      <QuizScoreList quizScores={quizScores} />
    </>
  );
}
