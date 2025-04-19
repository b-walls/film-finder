import React from 'react'
import { Link, Image, Text, VStack, HStack, Spacer} from '@chakra-ui/react'

const TMDBAttributionIcon = () => {
  return (
    <VStack align="center" justify={"center"}>
      <HStack>
        <Link href="https://www.themoviedb.org/" target="_blank">
          <Image src={"https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"}
            alt="Data provided by The Movie Database" 
            w="100px" 
            objectFit={"contain"}
          />
        </Link>
        <Spacer/>
        <Link href="https://www.justwatch.com/" target="_blank">
          <Image src={"https://widget.justwatch.com/assets/JW_logo_color_10px.svg"}
            alt="Data provided by Just Watch" 
            w="70px" 
            h="10px"
          />
        </Link>
      </HStack>
      <Text fontSize="xs" color="fg.muted" mb={4}>
        Provided by <Link  href="https://www.themoviedb.org/" target="_blank">themoviedb.org</Link> and <Link href="https://justwatch.com" target="_blank"> justwatch.com </Link>
      </Text>
    </VStack>
  )
}

export default TMDBAttributionIcon