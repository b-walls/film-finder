import React from 'react'
import { Link, Image, Text, VStack} from '@chakra-ui/react'

const TMDBAttributionIcon = () => {
  return (
    <VStack align="center">
      <Link href="https://www.themoviedb.org/">
        <Image src={"https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"} alt="Data provided by The Movie Database" w="100px" objectFit={"contain"}/>
      </Link>
      <Text fontSize="xs" color="fg.muted" mb={4}>
        Provided by <Link  href="https://www.themoviedb.org/">themoviedb.org</Link>
      </Text>
    </VStack>
  )
}

export default TMDBAttributionIcon