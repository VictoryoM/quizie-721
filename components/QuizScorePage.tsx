import {
    Box,
    Center,
    chakra,
    List,
    ListItem,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
} from '@chakra-ui/react';

interface QuizScore {
    title: string;
    score: number;
}

interface QuizScoreListProps {
    quizScores: QuizScore[];
}

function QuizScoreList(props: QuizScoreListProps) {
    const { quizScores } = props;
    const listItemBgColor = useColorModeValue('gray.100', 'gray.700');
    const listItemHoverBgColor = useColorModeValue('gray.200', 'gray.600');

    return (
        <SimpleGrid columns={{ base: 1, md: 1 }} spacing={8} mb={8}>
            <Center>
                <List spacing={3} w='80%'>
                    {quizScores.map((quizScore) => (
                        <ListItem
                            key={quizScore.title}
                            bg={listItemBgColor}
                            _hover={{ bg: listItemHoverBgColor }}
                            rounded="md"
                            p={4}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center">
                            <Box fontSize="lg" fontWeight="semibold" mb={2}>
                                {quizScore.title}
                            </Box>
                            <Stat textAlign={'right'}>
                                <StatLabel>Score</StatLabel>
                                <StatNumber>{`${quizScore.score}%`}</StatNumber>
                            </Stat>
                        </ListItem>
                    ))}
                </List>
            </Center>
        </SimpleGrid>
    );
}

export default function QuizScorePage() {
    const quizScores = [
        { title: 'Quiz 1', score: 80 },
        { title: 'Quiz 2', score: 95 },
        { title: 'Quiz 3', score: 70 },
        { title: 'Quiz 4', score: 85 },
        { title: 'Quiz 5', score: 60 },
    ];

    return (
        <>
            <Box maxW="7xl" mx="auto" pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                <chakra.h1
                    textAlign="center"
                    fontSize="4xl"
                    py={10}
                    fontWeight="bold">
                    Quiz Scores
                </chakra.h1>
            </Box>

            <QuizScoreList quizScores={quizScores} />
        </>
    );
}
