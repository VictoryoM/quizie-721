import {
  Menu,
  MenuButton,
  Button,
  Avatar,
  MenuList,
  Center,
  MenuDivider,
  MenuItem,
} from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function UserSignIn() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <Menu>
          <MenuButton
            as={Button}
            rounded={'full'}
            variant={'link'}
            cursor={'pointer'}
            minW={0}
          >
            <Avatar
              referrerPolicy='no-referrer'
              size={'sm'}
              src={
                session.user?.image
                  ? `${session.user?.image}}`
                  : 'https://avatars.dicebear.com/api/male/username.svg'
              }
            />
          </MenuButton>
          <MenuList alignItems={'center'}>
            <br />
            <Center>
              <Avatar
                size={'2xl'}
                referrerPolicy='no-referrer'
                src={
                  session.user?.image
                    ? `${session.user?.image}}`
                    : 'https://avatars.dicebear.com/api/male/username.svg'
                }
              />
            </Center>
            <br />
            <Center>
              <p>{session.user?.name}</p>
            </Center>
            <br />
            <MenuDivider />
            <MenuItem>
              <Link href={'/dashboard'}>Your Dashboard</Link>
            </MenuItem>
            <MenuItem>Account Settings</MenuItem>
            <MenuItem onClick={() => signOut()}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </>
    );
  }
  return (
    <>
      <Button
        as={'a'}
        fontSize={'sm'}
        fontWeight={600}
        color={'white'}
        bg={'pink.400'}
        onClick={() => signIn()}
        _hover={{
          bg: 'pink.300',
        }}
      >
        Sign In
      </Button>
    </>
  );
}
