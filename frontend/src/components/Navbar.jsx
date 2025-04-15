import { Container, Box, Text, Separator, Link, Flex, IconButton } from "@chakra-ui/react";

import React from 'react';
import { LuPopcorn, LuCupSoda } from "react-icons/lu";
import { IoLogoGithub } from "react-icons/io";
import { ColorModeButton} from "./ui/color-mode";
import { IoHome } from "react-icons/io5";


const Navbar = () => {
  return (
    <Container maxW={"1440px"} px={5}>
      <Flex
        bg={{base: "gray.100", _dark: "gray.900"}}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexDir={{ base: "column", sm: "row"}}
        minH={"50px"}
      >
        <Flex spaceX={3}>
          <Link href="/">
            <IconButton size={"50px"} bg="bg.muted" color={"slateblue"}>
              <IoHome />
            </IconButton>
          </Link>
          <Text 
            fontSize={{ base: "22", sm: "28" }}
            fontWeight="bold"
            color={""}
          >
              FilmFinderAI
          </Text>
        </Flex>
        <Flex>
          <IconButton bg="bg.muted" size={"10px"} px={1}>
            <Link href="https://github.com/b-walls" target="_blank" >
              <IoLogoGithub color={"slateblue"}/>
            </Link>
          </IconButton>
          <ColorModeButton color="slateblue"/>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Navbar