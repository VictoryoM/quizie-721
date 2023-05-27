import React, { ReactNode } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import { FiHome, FiCompass, FiStar, FiSettings, FiMenu } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';

interface LinkItemProps {
  name: string;
  icon: IconType;
  section: string;
  display: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, section: 'home', display: 'block' },
  // { name: 'Trending Topics', icon: FiTrendingUp, section: 'trending-topics'},
  {
    name: 'Remove Topics',
    icon: FiCompass,
    section: 'remove-topics',
    display: 'block',
  },
  { name: 'Ban Topics', icon: FiStar, section: 'ban-topics', display: 'block' },
  { name: 'Settings', icon: FiSettings, section: 'settings', display: 'block' },
];

export default function SimpleSidebar({ children, role, }: { children?: ReactNode; role:string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH='100vh' bg={useColorModeValue('gray.50', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        role= {role}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} role={role}/>
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p='4'>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  role: string;
}

const SidebarContent = ({ onClose, role, ...rest }: SidebarProps & { role: string }) => {
  const filteredLinkItems = role === 'admin' ? LinkItems : LinkItems.filter(item => item.section === 'settings' || item.section === 'home');

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      {...rest}
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        p='4'
      >
        <Text fontSize='xl' fontWeight='bold'>
          Dashboard
        </Text>
        <CloseButton
          display={{ base: 'block', md: 'none' }}
          onClick={onClose}
        />
      </Box>
      {filteredLinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          section={link.section}
          display={link.display}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};


interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  section: string;
}
const NavItem = ({ icon, children, section, ...rest }: NavItemProps) => {
  return (
    <ScrollLink to={section} spy={true} smooth={true} offset={-50}>
      <Flex
        align='center'
        p='4'
        mx='4'
        borderRadius='lg'
        role='group'
        cursor='pointer'
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr='4'
            fontSize='16'
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </ScrollLink>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      
      left={0}
      right={0}
      zIndex='999'
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height='20'
      alignItems='center'
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth='1px'
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent='flex-start'
      {...rest}
    >
      <IconButton
        variant='outline'
        onClick={onOpen}
        aria-label='open menu'
        icon={<FiMenu />}
      />

      <Text fontSize='2xl' ml='8' fontFamily='monospace' fontWeight='bold'>
        Dashboard
      </Text>
    </Flex>
  );
};
