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
            rounded={'lg'}>
            <StatLabel fontWeight={'medium'} isTruncated>
                {title}
            </StatLabel>
            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                {stat}
            </StatNumber>
        </Stat>
    );
}

export default function HomeStatistics() {

    return (
        <>
            <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                <chakra.h1
                    textAlign={'center'}
                    fontSize={'4xl'}
                    py={10}
                    fontWeight={'bold'}>
                    Home
                </chakra.h1>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
                    <StatsCard title={'Overall score'} stat={'60%'} />
                    <StatsCard title={'Attempted quizzes'} stat={'30'} />
                    <StatsCard title={'Previous quiz score'} stat={'80%'} />
                </SimpleGrid>
            </Box>
            <Center>
                <Box w={["60%", "90%", "100%"]}
                my={10}>
                    <Flex
                        flexDirection={{ base: "column", md: "row" }}
                        justifyContent="space-between"
                    >
                        <Box
                            shadow={'xl'}
                            border={'1px solid'}
                            borderColor={useColorModeValue('gray.400', 'gray.500')}
                            rounded={'lg'}
                            mt={10}
                            w={{ base: "full", md: "500px" }}
                            mx="auto">
                            <LineChart />
                        </Box>
                        <Box shadow={'xl'}
                            border={'1px solid'}
                            borderColor={useColorModeValue('gray.400', 'gray.500')}
                            rounded={'lg'}
                            mt={10}
                            w={{ base: "full", md: "500px" }}
                            mx="auto">
                            <BarChart />
                        </Box>
                    </Flex>
                </Box>
            </Center>

        </>
    );
}