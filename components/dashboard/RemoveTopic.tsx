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
} from '@chakra-ui/react';
import { DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { Topic, User } from '@prisma/client';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Topics {
  topics: Topic[];
  users: User[];
}

export default function RemoveTopic(props: Topics) {
  const { topics, users } = props;
  const router = useRouter();
  const listItemBgColor = useColorModeValue('gray.100', 'gray.700');
  const listItemHoverBgColor = useColorModeValue('gray.200', 'gray.600');

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTopics = topics.filter((topic) => {
    return topic.titleTopic.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = async (id: number) => {
    const name = 'topic';
    const response = await fetch('/api/delete/eraseData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id, name: name }),
    });
    if (response.status === 200) {
      router.reload();
    }
  };

  return (
    <Box mb='20'>
      <Heading textAlign='center'>Remove Topics</Heading>
      <Flex justify='center' mt={8}>
        <Box w={['100%', '80%']} maxW='750px'>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<SearchIcon color='red.300' />}
            />
            <Input
              placeholder='Search topics'
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
          {topics.length === 0 && (
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
            {filteredTopics.map((topic) => (
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
                <Text>
                  {users.find((user) => user.id === topic.quizMasterId)?.name}
                </Text>
                <IconButton
                  aria-label='Delete topic'
                  icon={<DeleteIcon />}
                  onClick={() => handleDelete(topic.id)}
                  colorScheme='red'
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Flex>
    </Box>
  );
}
