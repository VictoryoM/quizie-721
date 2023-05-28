import {
  Box,
  Heading,
  Input,
  IconButton,
  List,
  ListItem,
  Text,
  InputGroup,
  InputLeftElement,
  Flex,
  useColorModeValue,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Checkbox,
  Spacer,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { QuizMaster } from '@/models/dashboard';
import { Question, Topic } from '@prisma/client';
interface Topics {
  topics: QuizMaster[];
}
type Removes = {
  id: number;
  name: string;
  titleTopic: string;
  level: string;
};
export default function RemovesTopic(props: Topics) {
  const { topics } = props;
  const router = useRouter();
  const {
    isOpen: mEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: mDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const cancelRef: RefObject<HTMLButtonElement> = useRef(null);
  const listItemBgColor = useColorModeValue('gray.100', 'gray.700');
  const listItemHoverBgColor = useColorModeValue('gray.200', 'gray.600');
  const [searchTerm, setSearchTerm] = useState('');
  const [topicsMapped, setTopicsMapped] = useState<QuizMaster[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [removeTopics, setRemoveTopics] = useState<Removes>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  useEffect(() => {
    const filteredTopics: QuizMaster[] = [];
    topics.forEach((user: QuizMaster) => {
      if (user.topics.length > 0) {
        const topicsWithUser = user.topics.map((topic: any) => ({
          ...topic,
          name: user.name,
        }));
        filteredTopics.push(...topicsWithUser);
      }
    });
    setTopicsMapped(filteredTopics);
  }, [topics]);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const filteredTopics: QuizMaster[] = topicsMapped.filter((topic: any) => {
    return topic.titleTopic?.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const handleEdit = async (id: number) => {
    setIsDisabled(true);
    onOpenEdit();
    const response = await fetch('/api/edit/questionEdit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });
    const data = await response.json();
    setQuestions(data.message);
    setIsDisabled(false);
  };
  const handleDelete = async () => {
    setIsDisabled(true);
    const name = 'topic';
    const response = await fetch('/api/delete/eraseData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: removeTopics?.id, name: name }),
    });
    setIsDisabled(false);
    setRemoveTopics({} as Removes);
    if (response.status < 300) {
      onCloseDelete();
      router.replace(router.asPath);
    }
  };
  const handleDeleteQuestions = async () => {
    setIsDisabled(true);
    const name = 'question';
    const response = await fetch('/api/delete/eraseData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ques: selectedQuestions, name: name }),
    });
    setSelectedQuestions([]);
    setIsDisabled(false);
    if (response.status < 300) {
      onCloseDelete();
      onCloseEdit();
      router.replace(router.asPath);
    }
  };
  const handleCheckboxChange = (question: Question) => {
    const isSelected = selectedQuestions.some(
      (selectedQuestion) => selectedQuestion.id === question.id
    );

    if (isSelected) {
      // Remove the question from selectedQuestions
      const updatedSelectedQuestions = selectedQuestions.filter(
        (selectedQuestion) => selectedQuestion.id !== question.id
      );
      setSelectedQuestions(updatedSelectedQuestions);
    } else {
      // Add the question to selectedQuestions
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  return (
    <Box mb='20'>
      <Heading textAlign='center'>Remove Topics</Heading>
      <Flex justify='center' mt={8}>
        <Box w={['100%', '80%']} maxW='750px'>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <SearchIcon color='red.300' />
            </InputLeftElement>
            <Input
              placeholder='Search topics'
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
          {filteredTopics.length === 0 && (
            <Box textAlign='center'>
              <Text mt={4} fontStyle={'italic'} fontSize={'xl'}>
                No topics found
              </Text>
              <Link href={'/'}>
                <Button mt={4}>Create New</Button>
              </Link>
            </Box>
          )}
          <List
            mt={4}
            spacing={5}
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
            {filteredTopics.map((topic: any) => (
              <ListItem
                key={topic.id}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                bg={listItemBgColor}
                _hover={{ bg: listItemHoverBgColor }}
                rounded='md'
                p={4}
              >
                <Text>{topic.titleTopic}</Text>
                <Text>{topic.level}</Text>
                <Text>{topic.name}</Text>
                <Flex gap={1}>
                  <IconButton
                    aria-label='Edit topic'
                    icon={<EditIcon />}
                    onClick={() => handleEdit(topic.id)}
                    colorScheme='blue'
                  />
                  <IconButton
                    aria-label='Delete topic'
                    icon={<DeleteIcon />}
                    onClick={() => {
                      setRemoveTopics(topic);
                      onOpenDelete();
                    }}
                    colorScheme='red'
                  />
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
      </Flex>

      {/* Edit Modal */}

      <Modal
        isOpen={mEdit}
        onClose={() => {
          onCloseEdit();
          setQuestions([]);
          setSelectedQuestions([]);
        }}
        size={'3xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Questions Settings</ModalHeader>
          <Skeleton isLoaded={!isDisabled}>
            <ModalCloseButton />
            <ModalBody>
              <List
                mt={4}
                spacing={5}
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
                {questions.map((question) => (
                  <ListItem
                    display='flex'
                    alignItems='center'
                    key={question.id}
                    justifyContent='space-between'
                    bg={listItemBgColor}
                    _hover={{ bg: listItemHoverBgColor }}
                    rounded='md'
                    p={4}
                  >
                    <Flex direction={'column'}>
                      <Text>{question.question}</Text>
                      <Text
                        fontSize={'xs'}
                        fontWeight={'light'}
                        fontStyle={'italic'}
                      >
                        Date:
                        {new Date(question.createdAt)
                          .toISOString()
                          .substring(0, 10)}
                      </Text>
                    </Flex>
                    <Flex gap={1}>
                      <Checkbox
                        isChecked={selectedQuestions.some(
                          (selectedQuestion) =>
                            selectedQuestion.id === question.id
                        )}
                        onChange={() => handleCheckboxChange(question)}
                        border={'royalblue'}
                        aria-label='Delete topic'
                        colorScheme='red'
                      >
                        <Box
                          as={DeleteIcon}
                          color={
                            selectedQuestions.some(
                              (selectedQuestion) =>
                                selectedQuestion.id === question.id
                            )
                              ? 'red'
                              : 'black'
                          }
                          boxSize={5}
                        />
                      </Checkbox>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            </ModalBody>
          </Skeleton>

          <ModalFooter as={Flex}>
            <Box p='4'>
              <Text fontWeight={'semibold'} fontSize={'md'}>
                Selected Questions: {selectedQuestions.length}
              </Text>
              <Text fontWeight={'light'} fontStyle={'italic'} fontSize={'xs'}>
                <strong>Note:</strong> Deleted questions cannot be recovered and
                will be replaced with new questions!
              </Text>
            </Box>
            <Spacer />
            <Box p='4' as={Flex}>
              <Button
                colorScheme='blue'
                mr={3}
                onClick={() => {
                  onCloseEdit();
                  setQuestions([]);
                  setSelectedQuestions([]);
                }}
                display={{ base: 'none', md: 'block' }}
              >
                Cancel
              </Button>
              <Button
                variant={'outline'}
                rightIcon={<DeleteIcon />}
                color={'red'}
                border={'1px'}
                onClick={() => onOpenDelete()}
                isDisabled={selectedQuestions.length === 0}
              >
                Delete
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}

      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={() => {
          onCloseDelete(), setRemoveTopics({} as Removes);
        }}
        isOpen={mDelete}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>
            Delete
            {removeTopics?.titleTopic === undefined
              ? ' Questions'
              : ` Topic '${removeTopics?.titleTopic}'?`}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Text>
              Are you sure you want to delete
              {removeTopics?.titleTopic === undefined
                ? ' selected questions'
                : ` ${removeTopics?.titleTopic} from your quiz topic`}
              ?
            </Text>
            <Text fontWeight={'semibold'} fontStyle={'italic'} fontSize={'md'}>
              {removeTopics?.titleTopic === undefined
                ? `Number of Questions: ${selectedQuestions.length}`
                : `Title: ${removeTopics?.titleTopic}, Level: ${removeTopics?.level},
              MadeBy: ${removeTopics?.name}`}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                onCloseDelete(), setRemoveTopics({} as Removes);
              }}
            >
              No
            </Button>
            <Button
              colorScheme='red'
              ml={3}
              isLoading={isDisabled}
              onClick={
                removeTopics?.titleTopic === undefined
                  ? handleDeleteQuestions
                  : handleDelete
              }
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
