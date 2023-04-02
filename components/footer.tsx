import { Box, Text, useColorModeValue, Flex } from "@chakra-ui/react";
import QLogo from "../public/quizieLogo.png";
import Image from "next/image";

const Logo = (props: any) => {
  return <Image src={QLogo} alt={"Quizie"} width="100" height="0" />;
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Box py={10}>
        <Flex
          align={"center"}
          _before={{
            content: '""',
            borderBottom: "1px solid",
            borderColor: useColorModeValue("gray.200", "gray.700"),
            flexGrow: 1,
            mr: 8,
          }}
          _after={{
            content: '""',
            borderBottom: "1px solid",
            borderColor: useColorModeValue("gray.200", "gray.700"),
            flexGrow: 1,
            ml: 8,
          }}
        >
          <Logo />
        </Flex>
        <Text pt={6} fontSize={"sm"} textAlign={"center"}>
          © 2023 Quizie. All rights reserved
        </Text>
      </Box>
    </Box>
  );
}
