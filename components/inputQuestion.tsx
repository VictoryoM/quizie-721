import { QuestionIcon } from '@chakra-ui/icons';
import {
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  Center,
  Spacer,
  Button,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Box,
} from '@chakra-ui/react';
import { Question } from '@prisma/client';
import axios from 'axios';
import React, { ChangeEvent, useCallback, useRef, useState } from 'react';

interface Conversation {
  role: string;
  content: string;
}

export default function InputQuestion() {
  const [value, setValue] = useState<string>('');
  const [numberQue, setNumberQue] = useState<string>('');
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [questionAns, setQuestionAns] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  if (numberQue === '') {
    setNumberQue('1(one) question');
  }

  const handleSender = async () => {
    const questionAsked = [
      {
        role: 'user',
        content: `Please generate ${numberQue} on the topic "${value}". The question should have a correct answer and three other wrong answers, with all options shuffled randomly. Please make sure the correct answer and the correct answer in the options are the same and format the output as a JSON array with the following structure: [{ "question": "What is the capital of France?", "correct_answer": "Paris", "options": [ "Tokyo", "London", "Paris", "New York" ] }].`,
      },
    ];
    const response = await fetch('/api/openAIQuestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: questionAsked }),
    });
    setValue('');
    const arrays = await response.json();
    setConversation([
      { role: 'Quizie', content: arrays.result.choices[0].message.content },
    ]);
    setQuestionAns(arrays.result.choices[0].message.content);
    const replies = arrays.result.choices[0].message.content;
    let questions: Question[] = [];

    if (replies !== '') {
      questions = JSON.parse(replies);
      const { data } = await axios.post(`/api/questionsPosts`, questions);
      console.log(data);
    }
  };
  const handlerRefresh = () => {
    inputRef.current?.focus();
    setValue('');
    setConversation([]);
    setQuestionAns('');
  };

  let questions: Question[] = [];

  if (questionAns !== '' && questionAns !== questions.toString()) {
    questions = JSON.parse(questionAns);
    // console.log(questions);
  }

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
          <NumberInput
            onChange={(number) => {
              number === '' || number === '1'
                ? setNumberQue('1(one) question')
                : setNumberQue(number + ' questions');
            }}
            defaultValue={1}
            min={1}
            max={10}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Button colorScheme='blue' onClick={handlerRefresh}>
            New
          </Button>
        </InputGroup>
        <Button colorScheme='yellow' onClick={handleSender}>
          Send
        </Button>
        <div className='textarea'>
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
        </Box>
      </Stack>
    </Center>
  );
}
