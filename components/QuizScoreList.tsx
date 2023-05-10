import {
    Box,
    Center,
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
    score: string;
}

interface QuizScoreListProps {
    quizScores: QuizScore[];
}

export default function QuizScoreList(props: QuizScoreListProps) {
    const { quizScores } = props;
    const listItemBgColor = useColorModeValue('gray.100', 'gray.700');
    const listItemHoverBgColor = useColorModeValue('gray.200', 'gray.600');

    return (
        <SimpleGrid columns={{ base: 1, md: 1 }} spacing={8} mb={8}>
            <Center>
                <List spacing={3} w='80%' maxW={'750px'} overflowY={'scroll'} maxH={'400px'}
                style={{ scrollbarWidth: 'none', overflow: '-moz-scrollbars-none', msOverflowStyle: 'none' } as React.CSSProperties}>
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
                                <StatLabel>Amount</StatLabel>
                                <StatNumber>{quizScore.score}</StatNumber>
                            </Stat>
                        </ListItem>
                    ))}
                </List>
            </Center>
        </SimpleGrid>
    );
}