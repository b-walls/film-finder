import React from 'react'
import { Input, VStack, Container } from '@chakra-ui/react'
import SearchBar from '@/components/SearchBar'

const HomePage = () => {
  return (
    <Container maxW='container.xl' py={12}>
        <VStack spacing={8}>
            <SearchBar/>
        </VStack>
    </Container>
  )
}

export default HomePage