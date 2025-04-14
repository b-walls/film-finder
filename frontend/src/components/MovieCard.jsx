import React from 'react'
import { Box, Image, Text, Heading } from '@chakra-ui/react'

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
        <Heading as='h3' size='md' mb={2}>
        {movieData.title}
        </Heading>
    </Box>
    
  </Box>
  )
}

export default MovieCard