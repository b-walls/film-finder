import React from 'react'
import { Box, Image, Text, Heading, HStack, Flex, IconButton, Link} from '@chakra-ui/react'
import { LuExternalLink } from "react-icons/lu"


const MovieCard = ({ movieData }) => {
  return (
  <Box
  shadow='lg'
  rounded='lg'
  overflow='hidden'
  transition='all 0.3s'
  _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
  w="100%"
  >
    <Image src={movieData.poster} alt={movieData.title} w='100%'/>
    <Box p={4}>
        <Flex justifyContent={"space-between"}>
          <Heading as='h3' size='md' mb={2}>
          {movieData.title}
          </Heading>
          <Link href={movieData.imdb_id}>
          <IconButton bg="slateblue">
            <LuExternalLink />
          </IconButton>
          </Link>
        </Flex>
    </Box>
    
  </Box>
  )
}

export default MovieCard