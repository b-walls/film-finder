import {React, useEffect, useState } from 'react'
import { Button, 
        CloseButton, 
        Dialog, 
        Image, 
        HStack, 
        IconButton, 
        List, 
        Portal, 
        Icon, 
        Text, 
        Box, 
        Heading, 
        Separator,
        Flex,
        VStack} from "@chakra-ui/react"
import { IoIosInformationCircleOutline } from "react-icons/io";
import { RiNetflixFill } from "react-icons/ri";
import { TbBrandDisney } from "react-icons/tb";
import TMDBAttributionIcon from './TMDBAttributionIcon';

function formatDate(dateString) {

  if (!dateString) return "Unknown release date";

  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid release date";

  const options = { month: 'long' };
  const month = new Intl.DateTimeFormat('en-US', options).format(date);

  const day = date.getDate();
  const year = date.getFullYear();

  const ordinalSuffix = (n) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${month} ${day}${ordinalSuffix(day)}, ${year}`;
}

const MovieInfoDialog = ( { movieData, tmdbInfo }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <IconButton variant="outline" size="md" p={4}>
          Information <IoIosInformationCircleOutline />
        </IconButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content px={5}>
            <Dialog.Header>
              <Flex>
                <Dialog.Title>
                    <HStack>
                      {movieData.title} 
                      <Box borderWidth={"1px"} w="fit" px={1}>
                        <Text color="fg.muted">
                          {tmdbInfo.rating}
                        </Text>
                      </Box>
                    </HStack>
                </Dialog.Title>
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
              <HStack align="start" w="100%"> {/* Aligns the children to the top and left */}
                <VStack align="start" spacing={4}> {/* Aligns the text to the left and adds spacing */}
                  <Heading size="sm">
                    Release Date:
                    <Separator w="100%" />
                  </Heading>
                  <Text color="fg.muted">
                    {formatDate(tmdbInfo.release_date)}
                  </Text>
                  <Heading size="sm">
                    Genres:
                    <Separator w="100%" />
                  </Heading>
                  <Text color="fg.muted" flexWrap={"wrap"}>
                    {tmdbInfo.genres?.join(", ")}
                  </Text>
                  <Heading size="lg" fontWeight={"medium"}>
                    Overview
                    <Separator w="100%" />
                  </Heading>
                  <Text color="fg.muted">
                    {tmdbInfo.overview}
                  </Text>
                </VStack>
                <Image
                  align="end"
                  src={`${movieData.poster}`}
                  w="150px"
                  objectFit="contain"
                  rounded={"lg"}
                  shadow={"xl"}
                />
              </HStack>
            </Dialog.Body>
                <TMDBAttributionIcon/>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="md" color={"red.500"}/>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default MovieInfoDialog