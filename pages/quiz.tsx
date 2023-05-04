import type { InferGetServerSidePropsType } from 'next';
import { prisma } from '@/lib/db/clients';
import type { TopicResult } from '@prisma/client';
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
} from '@chakra-ui/react';
import { useState } from 'react';

export default function Quiz({
  questions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // console.log(questions);
  // const [value, setValue] = useState('');
  // console.log(value);

  const [answers, setAnswers] = useState<{ id: number; answer: string }[]>([]);
  const [errorAlert, setErrorAlert] = useState('');


  const [activeTab, setActiveTab] = useState(0);
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

  const submitHandler = async () => {
    console.log(answers);
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
    console.log(average);
    const percentage = (average / (attemptNum * 10)) * 100;
    console.log(`${percentage}%`);
    if (response.status === 400 || response.status === 500) {
      setErrorAlert('Please answer all the questions');
      onOpen();
    } else if (response.status === 401) {
      setErrorAlert('Please Sign In to take the quiz');
      onOpen();
    }

    // setAnswers([]);
  };

  const setValue = (event: any) => {
    const value = event;
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

  return (

    <>
    <Tabs variant={'soft-rounded'} colorScheme='green' isFitted my={10} index={activeTab}>
      <TabList>
        {questions.map((question, index) => (
          <Tab key={index}>{`Q ${index + 1}`}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {questions.map((question, index) => (
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
        <Alert status={'error'}>
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
        <Button onClick={handleNext} ml={4} isDisabled={activeTab === questions.length - 1}>
          Next
        </Button>
        {activeTab === questions.length - 1 && (
          <Button onClick={submitHandler} ml={4} colorScheme='green'>
            Submit
          </Button>
        )}
      </Box>
    </Center>
  </>



    // <>
    //   <Tabs variant={'soft-rounded'} colorScheme='green' isFitted my={10}>
    //     <TabList>
    //       {questions.map((question, index) => (
    //         <Tab key={index}>{`Q ${index + 1}`}</Tab>
    //       ))}
    //     </TabList>
    //     <TabPanels>
    //       {questions.map((question, index) => (
    //         <TabPanel key={index}>
    //           <Box
    //             mx={['5%', 'auto']}
    //             w={['90%', '70%']}
    //             mt={10}
    //             boxShadow='xl'
    //             p='6'
    //             rounded='md'
    //           >
    //             <Text fontSize={['md', 'lg']} fontWeight='bold'>
    //               {question.question}
    //             </Text>
    //             <RadioGroup onChange={setValue} mt={4}>
    //               <Stack spacing={2}>
    //                 {question.options.map((option, index) => (
    //                   <Radio
    //                     key={index}
    //                     value={JSON.stringify({
    //                       pickedAnswer: option,
    //                       questionId: question.id,
    //                     })}
    //                   >
    //                     <Text fontSize={['md', 'lg']}>{option}</Text>
    //                   </Radio>
    //                 ))}
    //               </Stack>
    //             </RadioGroup>
    //           </Box>
    //         </TabPanel>
    //       ))}
    //     </TabPanels>
    //   </Tabs>
    //   <Center flexDirection={'column'}>
    //     {isVisible && (
    //       <Alert status={'error'}>
    //         <AlertIcon />
    //         <Box>
    //           <AlertTitle>Error!</AlertTitle>
    //           <AlertDescription>{errorAlert}</AlertDescription>
    //         </Box>
    //         <CloseButton
    //           alignSelf='flex-start'
    //           position='relative'
    //           right={-1}
    //           top={-1}
    //           onClick={onClose}
    //         />
    //       </Alert>
    //     )}
    //     <Button onClick={submitHandler} mt={8} w='20%' colorScheme='green'>
    //       Submit
    //     </Button>
    //   </Center>
    // </>

  );
}

export async function getServerSideProps(titleTopic: any) {
  const topic = titleTopic.query.titleTopic;
  const level = titleTopic.query.level;
  if (!topic || !level) {
    return {
      notFound: true,
    };
  }
  const findTopicId = await prisma.topic.findFirst({
    where: {
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
    props: { questions },
  };
}
