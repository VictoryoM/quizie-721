import { Box, Heading, Input, IconButton, List, ListItem, Text, InputGroup, InputLeftElement, Flex, useColorModeValue } from '@chakra-ui/react'
import { DeleteIcon, SearchIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'

interface Topic {
  id: number;
  name: string;
}

const RemoveTopic = () => {

  const listItemBgColor = useColorModeValue('gray.100', 'gray.700');
  const listItemHoverBgColor = useColorModeValue('gray.200', 'gray.600');

  const [searchTerm, setSearchTerm] = useState("");

  //topics to pull from database
  const [topics, setTopics] = useState<Topic[]>([
    { id: 1, name: "Topic 1" },
    { id: 2, name: "Topic 2" },
    { id: 3, name: "Topic 3" },
    { id: 4, name: "Topic 4" },
    { id: 5, name: "Topic 5" },
  ]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTopics = topics.filter(topic => {
    return topic.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = (id: number) => {
    setTopics(topics.filter(topic => topic.id !== id));
  };

  return (
    <Box mb='20'>
      <Heading textAlign='center'>
        Remove Topics
      </Heading>
      <Flex justify='center' mt={8}>
        <Box w={['100%', '80%']} maxW='750px'>
          <InputGroup>
            <InputLeftElement pointerEvents='none' children={<SearchIcon color='red.300' />} />
            <Input placeholder='Search topics' value={searchTerm} onChange={handleSearch} />
          </InputGroup>
          <List mt={4} spacing={5}
          overflowY={'scroll'} maxH={'400px'}
          style={{ scrollbarWidth: 'none', overflow: '-moz-scrollbars-none', msOverflowStyle: 'none' } as React.CSSProperties}>
            {filteredTopics.map(topic => (
              <ListItem key={topic.id} display='flex' alignItems='center' justifyContent='space-between'
              bg={listItemBgColor}
              _hover={{ bg: listItemHoverBgColor }}
              rounded="md"
              p={4}>
                <Text>{topic.name}</Text>
                <IconButton aria-label='Delete topic' icon={<DeleteIcon />} onClick={() => handleDelete(topic.id)} colorScheme='red'/>
              </ListItem>
            ))}
          </List>
        </Box>
      </Flex>
    </Box>
  );
}

export default RemoveTopic;
