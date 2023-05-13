import {
  Box,
  chakra,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Flex,
  Center,
} from '@chakra-ui/react';
import LineChart from '@/components/dashboard/LineChart';
import BarChart from '@/components/dashboard/BarChart';

interface StatsCardProps {
  title: string;
  stat: string;
}
function StatsCard(props: StatsCardProps) {
  const { title, stat } = props;
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.400', 'gray.500')}
      rounded={'lg'}
    >
      <StatLabel fontWeight={'medium'} isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
        {stat}
      </StatNumber>
    </Stat>
  );
}
interface Stats {
  role: string;
  topicsTakenUser: number;
  scoreUser: number;
  numberOfUsers: number;
  todaysUsers: number;
  topicsTakenOverall: number;
  topicsAttemptUser: number;
}
export default function HomeStatistics(props: Stats) {
  const {
    role,
    numberOfUsers,
    todaysUsers,
    topicsTakenOverall,
    topicsTakenUser,
    scoreUser,
    topicsAttemptUser,
  } = props;
  return (
    <Box mb={20}>
      <Box maxW='7xl' mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        {role === 'Admin' ? (
          <>
            <chakra.h1
              textAlign={'center'}
              fontSize={'4xl'}
              py={10}
              fontWeight={'bold'}
            >
              Quizie Stats
            </chakra.h1>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={{ base: 5, lg: 8 }}
            >
              <StatsCard
                title={'Overall Users'}
                stat={numberOfUsers.toString()}
              />
              <StatsCard title={'Todays Users'} stat={todaysUsers.toString()} />
              <StatsCard
                title={'Number of Quizzes taken'}
                stat={topicsTakenOverall.toString()}
              />
            </SimpleGrid>
            <chakra.h1
              textAlign={'center'}
              fontSize={'4xl'}
              py={10}
              fontWeight={'bold'}
            >
              Your Stats
            </chakra.h1>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={{ base: 5, lg: 8 }}
            >
              <StatsCard title={'Overall score'} stat={scoreUser.toString()} />
              <StatsCard
                title={'Attempted quizzes'}
                stat={topicsAttemptUser.toString()}
              />
              <StatsCard
                title={'Number of Quizzes taken'}
                stat={topicsTakenUser.toString()}
              />
            </SimpleGrid>
          </>
        ) : (
          <>
            <chakra.h1
              textAlign={'center'}
              fontSize={'4xl'}
              py={10}
              fontWeight={'bold'}
            >
              Your Stats
            </chakra.h1>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={{ base: 5, lg: 8 }}
            >
              <StatsCard title={'Overall score'} stat={scoreUser.toString()} />
              <StatsCard
                title={'Attempted quizzes'}
                stat={topicsAttemptUser.toString()}
              />
              <StatsCard
                title={'Number of Quizzes taken'}
                stat={topicsTakenUser.toString()}
              />
            </SimpleGrid>
          </>
        )}
      </Box>
      <Center>
        <Box w={['100%', '90%', '80%']} my={10}>
          <Flex
            flexDirection={{ base: 'column', md: 'column', lg: 'row' }}
            justifyContent='space-between'
          >
            <Box
              shadow={'xl'}
              border={'1px solid'}
              borderColor={useColorModeValue('gray.400', 'gray.500')}
              rounded={'lg'}
              mt={10}
              w={{ base: 'full', md: '500px' }}
              mx='auto'
            >
              <LineChart />
            </Box>
            <Box
              shadow={'xl'}
              border={'1px solid'}
              borderColor={useColorModeValue('gray.400', 'gray.500')}
              rounded={'lg'}
              mt={10}
              w={{ base: 'full', md: '500px' }}
              mx='auto'
            >
              <BarChart />
            </Box>
          </Flex>
        </Box>
      </Center>
    </Box>
  );
}
