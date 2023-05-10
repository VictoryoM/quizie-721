import { Box, Heading } from '@chakra-ui/react'
import React from 'react'
import QuizScoreList from '../QuizScoreList';


const TrendingTopics = () => {
  const quizScores = [
    { title: 'Topic 1', score: '80' },
    { title: 'Topic 2', score: '95' },
    { title: 'Topic 3', score: '70' },
    { title: 'Topic 4', score: '85' },
    { title: 'Topic 5', score: '60' },
];

  return (
    <div>
    <Box mb={'20'}>
      <Heading textAlign={'center'} mb={'4'}>
        Trending Topics
      </Heading>
      <Box>
        <QuizScoreList quizScores={quizScores} />
      </Box>
    </Box>
  </div>
  )
}

export default TrendingTopics