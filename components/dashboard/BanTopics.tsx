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
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { BannedTopic } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { RefObject, useRef, useState } from 'react';

interface BanTopicsProps {
  banTopic: BannedTopic[];
}

export default function BanTopics(props: BanTopicsProps) {
  const { banTopic } = props;
  const router = useRouter();
  const listItemBgColor = useColorModeValue('gray.100', 'gray.700');
  const listItemHoverBgColor = useColorModeValue('gray.200', 'gray.600');
  const [topic, setTopic] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef: RefObject<HTMLButtonElement> = useRef(null);
  const [bannedTopics, setBannedTopics] = useState<BannedTopic>();

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
    if (response.status < 300) {
      setTopic('');
      router.replace(router.asPath);
    }
    // const { topicBanned, updatedAt }: BannedTopic = await response.json();
  };
  const handleDelete = async () => {
    const name = 'bannedTopic';
    const response = await fetch('/api/delete/eraseData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: bannedTopics?.id, name: name }),
    });
    if (response.status < 300) {
      onClose();
      setBannedTopics({} as BannedTopic);
      router.replace(router.asPath);
    }
  };

  return (
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
        <Button
          colorScheme='red'
          onClick={handleBanTopic}
          w='20%'
          isDisabled={topic === '' ? true : false}
        >
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
          {filteredTopicsBanned.length === 0 && (
            <Text
              textAlign={'center'}
              fontSize={'xl'}
              fontWeight={'semibold'}
              fontStyle={'italic'}
            >
              No banned topics
            </Text>
          )}
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
                onClick={() => {
                  onOpen();
                  setBannedTopics(banned);
                }}
                colorScheme='red'
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={() => {
          onClose();
          setBannedTopics({} as BannedTopic);
        }}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>
            Delete {''}
            {bannedTopics?.topicBanned}?
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Text>
              Are you sure you want to delete {''}
              {bannedTopics?.topicBanned} from banned topics?
            </Text>
            <Text fontWeight={'semibold'} fontStyle={'italic'} fontSize={'md'}>
              {bannedTopics?.topicBanned} will be deleted from banned topics.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                onClose();
                setBannedTopics({} as BannedTopic);
              }}
            >
              No
            </Button>
            <Button colorScheme='red' ml={3} onClick={handleDelete}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
