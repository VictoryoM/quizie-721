import { QuestionIcon, AddIcon } from '@chakra-ui/icons';
import {
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  Center,
  Spacer,
  Button,
  Box,
  Radio,
  RadioGroup,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useCallback, useRef, useState } from 'react';

export default function InputQuestion() {
  const [value, setValue] = useState<string>('');
  const [level, setLevel] = useState<string>('Easy');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const handleSender = async () => {
    setIsDisabled(true);
    const questionAsked = {
      topic: `${value}`,
      questions: `${level}`,
    };
    const response = await fetch('/api/openAIQuestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: questionAsked }),
    });
    if (response.status < 300) {
      router.replace(router.asPath);
    }
    setValue('');
    setLevel('Easy');
    setIsDisabled(false);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Center mt={10}>
        <Button leftIcon={<AddIcon />} colorScheme='green' onClick={onOpen}>
          Create New Topic
        </Button>
      </Center>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(270deg)'
        />
        <ModalContent>
          <ModalHeader textAlign={'center'}>Create a new Topic!!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center my={'10'}>
              <Stack w='40%' spacing={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents='none'>
                    <QuestionIcon color='red.300' />
                  </InputLeftElement>
                  <Input
                    type='text'
                    placeholder='Topic'
                    value={value}
                    onChange={handleInput}
                    w='20vw'
                  />
                </InputGroup>
                <Center>
                  <Box p='4'>
                    <RadioGroup onChange={setLevel} value={level}>
                      <Stack direction='row'>
                        <Radio value='Easy'>Easy</Radio>
                        <Radio value='Medium'>Medium</Radio>
                        <Radio value='Hard'>Hard</Radio>
                      </Stack>
                    </RadioGroup>
                  </Box>
                </Center>
                <Button
                  isLoading={isDisabled}
                  loadingText='Sending'
                  colorScheme='yellow'
                  onClick={handleSender}
                >
                  Send
                </Button>
              </Stack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
