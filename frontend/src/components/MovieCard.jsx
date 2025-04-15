import React from 'react'
import { Box, Image, Text, Heading, HStack, Flex, IconButton, Link, RatingGroup } from '@chakra-ui/react'
import { LuExternalLink } from "react-icons/lu"
import { useNavigate } from "react-router-dom";


const MovieCard = ({ movieData }) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/recommendations?query=${encodeURIComponent(movieData.title)}`)
  }
  
  return (
  <Box
  shadow='lg'
  rounded='lg'
  overflow='hidden'
  transition='all 0.3s'
  _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
  w="100%"
  >
    <Image src={movieData.poster} alt={movieData.title} w='100%' h="600px" cursor="pointer" onClick={handleSearch}/>
    <Box p={4}>
        <Flex justifyContent={"space-between"}>
          <Heading as='h3' size='md' mb={2}>
          {movieData.title}
          </Heading>
          <HStack>
            <RatingGroup.Root disabled allowHalf count={5} defaultValue={Math.floor(movieData.rating / 2 * 2) / 2} size="sm" color={"slateblue"}>
              <RatingGroup.HiddenInput />
              <RatingGroup.Control />
            </RatingGroup.Root>
            <Link href={movieData.imdb_id} target="_blank">
            <IconButton bg="slateblue">
              <LuExternalLink />
            </IconButton>
            </Link>
          </HStack>
        </Flex>
    </Box>
    
  </Box>
  )
}

export default MovieCard