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
import { getServerSession } from 'next-auth';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function UserSignIn(props: any) {
  const { user, onSignIn, onSignOut } = props;
  // console.log(user);

  if (user) {
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
                user.image
                  ? `${user.image}}`
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
                  user.image
                    ? `${user.image}}`
                    : 'https://avatars.dicebear.com/api/male/username.svg'
                }
              />
            </Center>
            <br />
            <Center>
              <p>{user.name}</p>
            </Center>
            <br />
            <MenuDivider />
            <MenuItem>Your Dashboard</MenuItem>
            <MenuItem>Account Settings</MenuItem>
            <MenuItem onClick={() => onSignOut()}>Logout</MenuItem>
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
        onClick={() => onSignIn()}
        _hover={{
          bg: 'pink.300',
        }}
      >
        Sign In
      </Button>
    </>
  );
}

// export async function getServerSideProps(context: any) {
//   const session = await getServerSession(context.req, context.res, authOptions);
//   return {
//     props: {
//       session,
//     },
//   };
// }
