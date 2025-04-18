import React from 'react'
import { Link, Image, Text, VStack} from '@chakra-ui/react'

const TMDBAttributionIcon = () => {
  return (
    <VStack align="center">
      <Link href="https://www.themoviedb.org/">
        <Image src={"/TMDB-logo.svg"} alt="Data provided by The Movie Database" w="100px" objectFit={"contain"}/>
      </Link>
      <Text fontSize="xs" color="fg.muted" mb={4}>
        Provided by <Link  href="https://www.themoviedb.org/">themoviedb.org</Link>
      </Text>
    </VStack>
  )
}

export default TMDBAttributionIcon