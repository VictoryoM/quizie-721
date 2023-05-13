import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Heading,
  Input,
  Button,
  IconButton,
  List,
  ListItem,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { BannedTopic } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface BanTopicsProps {
  banTopic: BannedTopic[];
}

export default function BanTopics(props: BanTopicsProps) {
  const { banTopic } = props;
  const router = useRouter();
  const listItemBgColor = useColorModeValue('gray.100', 'gray.700');
  const listItemHoverBgColor = useColorModeValue('gray.200', 'gray.600');
  const [topic, setTopic] = useState('');

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
  };
  const filteredTopicsBanned = banTopic.filter((banned) => {
    return banned.topicBanned.toLowerCase().includes(topic.toLowerCase());
  });

  const handleBanTopic = async () => {
    const response = await fetch('/api/delete/banTopic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topicBanned: topic }),
    });
    router.reload();
    // setTopic('');
    // const { topicBanned, updatedAt }: BannedTopic = await response.json();
  };
  const handleDelete = async (id: number) => {
    const name = 'bannedTopic';
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
    <div>
      <Box mb={20}>
        <Box mb={10}>
          <Heading textAlign={'center'}>Ban Topics</Heading>
        </Box>
        <Box w={['100%', '80%']} maxW='750px' mx='auto'>
          <Input
            placeholder='Enter topic to ban'
            value={topic}
            onChange={handleTopicChange}
            w='77%'
            mr={4}
          />
          <Button colorScheme='red' onClick={handleBanTopic} w='20%'>
            Ban
          </Button>
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
            {filteredTopicsBanned.map((banned) => (
              <ListItem
                key={banned.id}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                bg={listItemBgColor}
                _hover={{ bg: listItemHoverBgColor }}
                rounded='md'
                p={4}
              >
                <Text>{banned.topicBanned}</Text>
                <Text>
                  {new Date(banned.createdAt).toISOString().substring(0, 10)}
                </Text>
                <IconButton
                  aria-label='Delete topic'
                  icon={<DeleteIcon />}
                  onClick={() => handleDelete(banned.id)}
                  colorScheme='red'
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </div>
  );
}
