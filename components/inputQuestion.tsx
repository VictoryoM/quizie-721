import { QuestionIcon } from '@chakra-ui/icons';
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
} from '@chakra-ui/react';
import Link from 'next/link';
import React, { ChangeEvent, useCallback, useRef, useState } from 'react';

interface Conversation {
  role: string;
  content: string;
}

export default function InputQuestion() {
  const [value, setValue] = useState<string>('');
  const [level, setLevel] = useState<string>('Easy');
  // const [conversation, setConversation] = useState<Conversation[]>([]);
  // const [questionAns, setQuestionAns] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const handleSender = async () => {
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
    setValue('');
    setLevel('Easy');
  };
  // const handlerRefresh = () => {
  //   inputRef.current?.focus();
  //   setValue('');
  //   setLevel('Easy');
  // };

  return (
    <Center>
      <Stack w='40%' spacing={4}>
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            children={<QuestionIcon color='red.300' />}
          />
          <Input
            type='tel'
            placeholder='Topic'
            value={value}
            onChange={handleInput}
            // onKeyDown={handleKeyDown}
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
          {/* <Spacer />
          <Box p='4'>
            <Button colorScheme='blue' onClick={handlerRefresh}>
              New
            </Button>
          </Box> */}
        </Center>
        {/* <Link
          href={{
            pathname: '/trial',
            query: { titleTopic: `${value}`, level: `${level}` },
          }}
        > */}
        <Button colorScheme='yellow' onClick={handleSender}>
          Send
        </Button>
        {/* </Link> */}
      </Stack>
    </Center>
  );
}
