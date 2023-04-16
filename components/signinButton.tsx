import { authOptions } from '@/pages/api/auth/[...nextauth]';
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
import { getServerSession } from 'next-auth/next';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function UserSignIn() {
  const { data: session } = useSession();
  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session.user?.email} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   );
  // }
  // return (
  //   <>
  //     Not signed in <br />
  //     <button onClick={() => signIn()}>Sign in</button>
  //   </>
  // );
  console.log(session?.user);

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
            <MenuItem>Your Dashboard</MenuItem>
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
        display={{ base: 'none', md: 'inline-flex' }}
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

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log(session?.user?.name);
  return {
    props: {
      session,
    },
  };
}
