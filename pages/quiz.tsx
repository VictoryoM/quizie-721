import type { InferGetServerSidePropsType } from 'next';
import { prisma } from '@/lib/db/clients';
import type { Question, TopicResult } from '@prisma/client';
import {
  Center,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { GiTrophyCup } from 'react-icons/gi';
import { useRouter } from 'next/router';

export default function Quiz({
  questions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const quests: Question[] = questions;

  const [answers, setAnswers] = useState<{ id: number; answer: string }[]>([]);
  const [errorAlert, setErrorAlert] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState(0);

  // modal open and close useDisclosure
  const router = useRouter();
  const {
    isOpen: isScoreModalOpen,
    onOpen: scoreModalOpen,
    onClose: scoreModalClose,
  } = useDisclosure();
  const [correctScore, setCorrectScore] = useState<number>(0);
  const [avgScore, setAvgScore] = useState<number>(0);
  const [percentScore, setPercentScore] = useState<string>('');
  const handleModalClose = () => {
    scoreModalClose();
    router.push('/');
  };

  const handlePrev = () => {
    setActiveTab(Math.max(activeTab - 1, 0));
  };

  const handleNext = () => {
    setActiveTab(Math.min(activeTab + 1, questions.length - 1));
  };

  console.log(answers);
  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: false });

  const setValue = (value: any) => {
    // const value = event;
    const answer = JSON.parse(value); // Parse the string value into an object
    const answeredQuestion = answers.find((q) => q.id === answer.questionId);

    if (answeredQuestion) {
      // If the question is already answered, update the answer
      const updatedAnswers = answers.map((q) => {
        if (q.id === answer.questionId) {
          return { id: answer.questionId, answer: answer.pickedAnswer };
        } else {
          return q;
        }
      });
      onClose();
      setAnswers(updatedAnswers);
    } else {
      // If the question is not answered, add the new answer
      const newAnswer = { id: answer.questionId, answer: answer.pickedAnswer };
      setAnswers([...answers, newAnswer]);
      onClose();
    }
  };

  const submitHandler = async () => {
    setIsDisabled(true);
    // console.log(answers);
    const response = await fetch('/api/quizScore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: answers }),
    });
    const { average, attemptNum, correctNum }: TopicResult =
      await response.json();
    console.log(correctNum);
    setCorrectScore(correctNum);
    console.log(average);
    setAvgScore(average);
    const percentage = ((average / (attemptNum * 10)) * 100).toFixed(2);
    console.log(`${percentage}%`);
    setPercentScore(percentage);

    //open the scoreModal
    scoreModalOpen();

    if (response.status === 400 || response.status === 500) {
      setErrorAlert('Please answer all the questions');
      onOpen();
    } else if (response.status === 401) {
      setErrorAlert('Please Sign In to take the quiz');
      onOpen();
    }

    // setAnswers([]);
    setIsDisabled(false);
  };

  return (
    <>
      <Tabs
        variant={'soft-rounded'}
        colorScheme='green'
        isFitted
        my={10}
        index={activeTab}
      >
        <TabList>
          {quests.map((question, index) => (
            <Tab key={index} onClick={() => setActiveTab(index)}>{`Q ${
              index + 1
            }`}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {quests.map((question, index) => (
            <TabPanel key={index}>
              <Box
                mx={['5%', 'auto']}
                w={['90%', '70%']}
                mt={10}
                boxShadow='xl'
                p='6'
                rounded='md'
              >
                <Text fontSize={['md', 'lg']} fontWeight='bold'>
                  {question.question}
                </Text>
                <RadioGroup onChange={setValue} mt={4}>
                  <Stack spacing={2}>
                    {question.options.map((option, index) => (
                      <Radio
                        key={index}
                        value={JSON.stringify({
                          pickedAnswer: option,
                          questionId: question.id,
                        })}
                      >
                        <Text fontSize={['md', 'lg']}>{option}</Text>
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <Center flexDirection={'column'}>
        {isVisible && (
          <Alert status={'error'} alignItems='center' justifyContent='center'>
            <AlertIcon />
            <Box>
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{errorAlert}</AlertDescription>
            </Box>
            <CloseButton
              alignSelf='flex-start'
              position='relative'
              right={-1}
              top={-1}
              onClick={onClose}
            />
          </Alert>
        )}
        <Box mt={8}>
          <Button onClick={handlePrev} mr={4} isDisabled={activeTab === 0}>
            Prev
          </Button>
          <Button
            onClick={handleNext}
            ml={4}
            isDisabled={activeTab === questions.length - 1}
          >
            Next
          </Button>
        </Box>

        <Button
          isLoading={isDisabled}
          loadingText='Submitting'
          onClick={submitHandler}
          my={4}
          colorScheme='green'
          w={['30%', '20%']}
          isDisabled={answers.length !== questions.length}
        >
          Submit
        </Button>
      </Center>
      <Modal isOpen={isScoreModalOpen} onClose={scoreModalClose}>
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(270deg)'
        />
        <ModalContent>
          <ModalHeader>
            {' '}
            <GiTrophyCup color='orange' />
            Your Score!!!
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={'lg'}>Correct Answers : {correctScore}</Text>
            <Text fontSize={'lg'}>Average For Quiz : {avgScore}</Text>
            <Text fontSize={'lg'}>Percentage For Quiz : {percentScore}%</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={handleModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export async function getServerSideProps(titleTopic: any) {
  const topic = titleTopic.query.titleTopic;
  const level = titleTopic.query.level;
  const id = titleTopic.query.id;
  if (!topic || !level) {
    return {
      notFound: true,
    };
  }
  const findTopicId = await prisma.topic.findFirst({
    where: {
      id: parseInt(id),
      titleTopic: topic,
      level: level,
    },
  });
  // if (!findTopicId) {
  //   Router.replace(Router.asPath);
  // }
  const questions = await prisma.question.findMany({
    where: {
      topicId: findTopicId![`id`],
    },
  });

  return {
    props: { questions: JSON.parse(JSON.stringify(questions)) },
  };
}
