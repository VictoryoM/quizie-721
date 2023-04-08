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
import { Question } from '@prisma/client';
import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import Questions from './questionsList';

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
  const handlerRefresh = () => {
    inputRef.current?.focus();
    setValue('');
    setLevel('Easy');
  };

  // let questions: Question[] = [];

  // if (questionAns !== '' && questionAns !== questions.toString()) {
  //   questions = JSON.parse(questionAns);
  //   // console.log(questions);
  // }

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
        <Flex>
          <Box p='4'>
            <RadioGroup onChange={setLevel} value={level}>
              <Stack direction='row'>
                <Radio value='Easy'>Easy</Radio>
                <Radio value='Medium'>Medium</Radio>
                <Radio value='Hard'>Hard</Radio>
              </Stack>
            </RadioGroup>
          </Box>
          <Spacer />
          <Box p='4'>
            <Button colorScheme='blue' onClick={handlerRefresh}>
              New
            </Button>
          </Box>
        </Flex>
        <Button colorScheme='yellow' onClick={handleSender}>
          Send
        </Button>
        {/* <div className='textarea'>
          {conversation.map((item, index) => (
            <React.Fragment key={index}>
              <Spacer />
              {item.role === 'Quizie' ? (
                <div>
                  <strong>Quizie</strong>
                  <br />
                  {item.content}
                </div>
              ) : (
                <div>
                  <strong>User</strong>
                  <br />
                  {item.content}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <Box>
          {questions.map((item, index) => (
            <React.Fragment key={index}>
              <Spacer />
              {item.question !== '' ? (
                <div>
                  <br />
                  {item.question}
                  {item.correct_answer}
                  {item.options?.map((option, index) => (
                    <React.Fragment key={index}>
                      <br />
                      {option}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div></div>
              )}
            </React.Fragment>
          ))}
        </Box> */}
      </Stack>
    </Center>
  );
}
