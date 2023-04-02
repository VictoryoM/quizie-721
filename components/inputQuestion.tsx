import { QuestionIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import React, { ChangeEvent, useCallback, useRef, useState } from "react";

interface Conversation {
  role: string;
  content: string;
}

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export default function InputQuestion() {
  const [value, setValue] = useState<string>("");
  const [numberQue, setNumberQue] = useState<string>("");
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [questionAns, setQuestionAns] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  //   const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
  //     // const chatStarter = [
  //     //   ...conversation,
  //     //   {
  //     //     role: "system",
  //     //     content:
  //     //       "You are a quiz generator and the topic is below, you will generate a multiple choices with answer",
  //     //   },
  //     // ];
  //     // const response = await fetch("/api/openAIQuestion", {
  //     //   method: "POST",
  //     //   headers: {
  //     //     "Content-Type": "application/json",
  //     //   },
  //     //   body: JSON.stringify({ messages: chatStarter }),
  //     // });
  //     if (e.key === "Enter") {
  //       const chatHistory = [
  //         ...conversation,
  //         {
  //           role: "user",
  //           content:
  //             "You are to generate 10 multiple choices with answer and the topic is " +
  //             value +
  //             ", you will generate it with this format {number: number, question: question, A: A, B: B, C: C, D: D, answer: answer}",
  //         },
  //       ];
  //       const response = await fetch("/api/openAIQuestion", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ messages: chatHistory }),
  //       });

  //       const data = await response.json();
  //       setValue("");
  //       setConversation([
  //         ...chatHistory,
  //         { role: "user", content: data.result.choices[0].message.content },
  //       ]);
  //     }
  //   };

  if (numberQue === "") {
    setNumberQue("1 question");
  }

  const handleSender = async () => {
    const chatHistory = [
      ...conversation,
      {
        role: "user",
        content: `Please generate only ${numberQue} on this topic : ${value}. and the correct answer. and 3 other wrong answers the output should be in json format like this. keep the questions and answers simple and short also please no number or \n in front of each object. and please use the same format as the example below. thank you. [{ "question": "What is the most popular web development language?", "correct_answer": "JavaScript", "incorrect_answers": [ "Python", "PHP", "C++" ] },]`,
      },
    ];
    const response = await fetch("/api/openAIQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: chatHistory }),
    });
    setValue("");
    const data = await response.json();
    setConversation([
      ...chatHistory,
      { role: "assistant", content: data.result.choices[0].message.content },
    ]);
    setQuestionAns(data.result.choices[0].message.content);
  };
  const handlerRefresh = () => {
    inputRef.current?.focus();
    setValue("");
    setConversation([]);
    setQuestionAns("");
  };

  // console.log(questionAns);

  let questions: Question[] = [];

  if (questionAns !== "") {
    questions = JSON.parse(questionAns);
  }
  console.log(questions);

  return (
    <Center>
      <Stack w="40%" spacing={4}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<QuestionIcon color="gray.300" />}
          />
          <Input
            type="tel"
            placeholder="Topic"
            value={value}
            onChange={handleInput}
            // onKeyDown={handleKeyDown}
          />
          <NumberInput
            onChange={(number) => {
              number === "" || number === "1"
                ? setNumberQue("1 question")
                : setNumberQue(number + " questions");
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
          <Button colorScheme="green" onClick={handleSender}>
            Send
          </Button>
        </InputGroup>
        <Button colorScheme="blue" onClick={handlerRefresh}>
          Start New
        </Button>
        <div className="textarea">
          {conversation.map((item, index) => (
            <React.Fragment key={index}>
              <Spacer />
              {item.role === "assistant" ? (
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
        <p>{questionAns}</p>
        {/* <Box>
          {question.map((item, index) => (
            <React.Fragment key={index}>
              <Spacer />
              {item.content !== "" ? (
                <div>
                  <br />
                  {item.content}
                  {item.correct_answer}
                  {item.incorrect_answers}
                </div>
              ) : (
                <div>
                </div>
              )}
            </React.Fragment>
          ))}
        </Box> */}
      </Stack>
    </Center>
  );
}
