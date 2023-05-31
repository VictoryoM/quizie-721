import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { RefObject, useRef, useState } from 'react';
import { signOut } from 'next-auth/react';

const Settings = () => {
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const {
    isOpen: mDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const cancelRef: RefObject<HTMLButtonElement> = useRef(null);

  const handleDelete = async () => {
    console.log('delete');
    setIsDisabled(true);
    // const timer = setTimeout(() => {
    //   console.log('This will run after 1 second!');
    // }, 1000);
    const response = await fetch('/api/delete/delUser', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status < 300) {
      onCloseDelete();
      setIsDisabled(false);
      await signOut();
      router.push('/');
    }
    setError('Something went wrong');
    setIsDisabled(false);
  };
  return (
    <Box mb={'40'}>
      <Heading textAlign={'center'}>Settings</Heading>
      <Box mb={10}>
        <Flex w={['100%', '80%']} maxW='750px' mx='auto' direction={'column'}>
          <Text fontSize={'xl'} color={'red'} fontWeight={'bold'}>
            Delete Account
          </Text>
          <Divider border={'1px'} color={'grey'} />
          <Text fontSize={'md'} mt={4}>
            Once you delete your account, there is no going back. Please be
            certain.
          </Text>
          <Text fontSize={'md'} mt={4}>
            <strong>WARNING:</strong> This action is irreversible.
          </Text>
          <Button
            mt={4}
            colorScheme={'gray'}
            w={'30%'}
            color={'red'}
            _hover={{ color: 'white', bg: 'red.500' }}
            onClick={onOpenDelete}
          >
            Delete Account
          </Button>
        </Flex>
      </Box>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={() => {
          onCloseDelete();
        }}
        isOpen={mDelete}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete Account?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Text>Are you sure you want to delete your account?</Text>
            <Text fontWeight={'semibold'} fontStyle={'italic'} fontSize={'sm'}>
              <strong>WARNING:</strong> This action will delete all your record.
            </Text>
            {error && (
              <Text color={'red'} fontWeight={'bold'}>
                {error}
              </Text>
            )}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                onCloseDelete();
              }}
            >
              No
            </Button>
            <Button
              colorScheme='red'
              ml={3}
              isLoading={isDisabled}
              onClick={handleDelete}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default Settings;
