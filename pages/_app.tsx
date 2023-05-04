import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import '@/styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Flex } from '@chakra-ui/react'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Flex direction={'column'} minH={"100vh"}>
          <Flex direction={'column'} grow={1}>
            <Navbar />
            <Component {...pageProps} />
          </Flex>
          <Footer />
        </Flex>
      </ChakraProvider>
    </SessionProvider>
  );
}
