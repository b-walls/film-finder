import { useState } from 'react'
import { Box, Text, Separator } from "@chakra-ui/react"
import { Route, Routes } from 'react-router-dom';
import Navbar from '@/components/Navbar'
import HomePage from '@/pages/HomePage'
import RecommendPage from './pages/RecommendPage';

function App() {

  return (
    <Box minH={"100vh"} bg={{base: "gray.100", _dark: "gray.900"}}>
        <Navbar/>
        <Separator></Separator>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/recommendations" element={<RecommendPage/>}/>
        </Routes>
    </Box>
  )
}

export default App
