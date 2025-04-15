import { Container, Box, Text, Separator, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import React from 'react';
import { LuPopcorn, LuCupSoda } from "react-icons/lu";
import { ColorModeButton} from "./ui/color-mode";

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
          <LuPopcorn size={"20"}/>
          <Text 
            fontSize={{ base: "22", sm: "28" }}
            fontWeight="bold"
            color={"slateblue"}
            textAlign="center"
          >
            <Link to="/"style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>  
              FilmFinderAI
            </Link>
          </Text>
        </Flex>
        <ColorModeButton color="slateblue"/>
      </Flex>
    </Container>
  );
};

export default Navbar