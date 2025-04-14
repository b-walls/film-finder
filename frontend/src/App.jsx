import { useState } from 'react'
import { Box, Text, Separator } from "@chakra-ui/react"
import Navbar from '@/components/Navbar'
import HomePage from '@/pages/HomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box minH={"100vh"} bg={{base: "gray.100", _dark: "gray.900"}}>
        <Navbar/>
        <Separator></Separator>
        <HomePage/>
    </Box>
  )
}

export default App
