import {React } from 'react'
import { Button, 
        CloseButton, 
        Dialog, 
        Image, 
        HStack, 
        IconButton, 
        Portal, 
        RatingGroup, 
        Text, 
        Box, 
        Heading, 
        Separator,
        Flex,
        VStack,
        Link,
        Spacer} from "@chakra-ui/react"
import { FaExternalLinkAlt } from "react-icons/fa";
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

const MovieInfoDialog = ( { movieData, tmdbInfo, children}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children}
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
                      { tmdbInfo.rating ? ( 
                        <Box borderWidth={"1px"} w="fit" px={1}>
                        <Text color="fg.muted">
                          {tmdbInfo.rating}
                        </Text>
                      </Box>
                      ) : (
                        <Box/>
                      )}
                    </HStack>
                </Dialog.Title>
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
              {/* General information */}
              <Flex align="start" w="100%" mb={4} gap={2}> {/* Aligns the children to the top and left */}
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
                <VStack align={"center"} justify={"center"} minW={"180px"}>
                  <Link href={`https://www.imdb.com/title/${movieData.imdb_id}`} target="_blank">
                    <Image
                      src={`${movieData.poster}`}
                      w="100%"
                      h="100%"
                      objectFit={"contain"}
                      rounded={"lg"}
                      shadow={"xl"}
                    />
                  </Link>
                  <HStack align={"center"} justify={"center"}>
                    <Image src={"https://m.media-amazon.com/images/G/01/IMDb/brand/guidelines/imdb/IMDb_Logo_Rectangle_Gold._CB443386186_.png"} h={5}/>
                  <RatingGroup.Root
                    disabled
                    allowHalf
                    count={5}
                    defaultValue={Math.floor(movieData.rating + 0.5) / 2}
                    size="sm"
                    colorPalette={"yellow"}
                  >
                    <RatingGroup.HiddenInput />
                    <RatingGroup.Control/>
                  </RatingGroup.Root>
                  <Link href={`https://www.imdb.com/title/${movieData.imdb_id}`} target="_blank">
                    <IconButton size={"2xs"} bg="slateblue">
                      <FaExternalLinkAlt/>
                    </IconButton>
                  </Link>
                  </HStack>
                </VStack>
              </Flex>
              {/* Provider information */}
              <VStack align="start">
              <Link href={tmdbInfo.providers?.link} target="_blank" variant="underline" >
                <Heading size="lg" fontWeight="semibold" align="center"> 
                  Where to watch 
                </Heading>
              </Link>
              <HStack>
              {tmdbInfo.providers?.stream ? (
                <>
                <VStack align="start">
                  <Text size="md" fontWeight={"bold"}> Stream </Text>
                <HStack>
                  {tmdbInfo.providers.stream.map((provider, idx) => (
                    <Image key={idx} src={`https://image.tmdb.org/t/p/w500/${provider.logo_path}`} objectFit={"contain"} w="50px" rounded={"md"}/>
                  ))}
                </HStack>
                </VStack>
                <Spacer w={"2px"}/>
                </>
              ) : (
                <Text color="fg.muted"></Text>
              )}
               {tmdbInfo.providers?.rent ? (
                <>
                <VStack align="start">
                  <Text size="md" fontWeight={"bold"}> Rent </Text>
                <HStack>
                  {tmdbInfo.providers.rent.map((provider, idx) => (
                    <Image key={idx} src={`https://image.tmdb.org/t/p/w500/${provider.logo_path}`} objectFit={"contain"} w="50px" rounded={"md"}/>
                  ))}
                </HStack>
                </VStack>
                <Spacer w={"2px"}/>
                </>
              ) : (
                <Text color="fg.muted"></Text>
              )}
              {tmdbInfo.providers?.buy ? (
                <VStack align="start">
                  <Text size="md" fontWeight={"bold"}> Buy </Text>
                <HStack>
                  {tmdbInfo.providers.buy.map((provider, idx) => (
                      <Image key={idx} src={`https://image.tmdb.org/t/p/w500/${provider.logo_path}`} objectFit={"contain"} w="50px" rounded={"md"}/>
                  ))}
                </HStack>
                </VStack>
              ) : (
                <Text color="fg.muted"></Text>
              )}
              </HStack>
              </VStack>
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