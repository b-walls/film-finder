import {React, useState, useEffect} from 'react'
import { VStack, Container, Heading, Separator, Spacer, Box, SimpleGrid, Highlight } from '@chakra-ui/react'
import SearchBar from '@/components/SearchBar'
import MovieCard from '@/components/MovieCard'

const HomePage = () => {
  const [movieDataList, setMovieDataList] = useState([]);
  const [popular, setPopular] = useState([]);

  const fetchPopular = async () => {
    try {
      const response = await fetch(`/api/popular-titles`);
      const data = await response.json();
      setPopular(data.popular || []);
    } catch (error) {
      setPopular([]);
    }
  };

  const fetchAllMovies = async (movies) => {
    try {
      const movieDataPromises = movies.map(async (movie) => {
        const response = await fetch(`/api/movie-data?title=${movie}`);
        return response.json();
      });
      const movieData = await Promise.all(movieDataPromises);
      setMovieDataList(movieData);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  };

  useEffect(() => {
        fetchPopular();
    }, []);

    useEffect(() => {
      if (popular.length > 0) {
        fetchAllMovies(popular);
      }
    }, [popular]);

  return (
    <Container maxW="container.xl" alignItems={"center"} bg={{base: "gray.100", _dark: "gray.900"}}>
      <Box borderLeftWidth={"1px"} borderRightWidth={"1px"} minH={"100vh"} bg={{base: "gray.100", _dark: "gray.900"}}>
        <VStack spacing={8} py={5}bg={{base: "gray.100", _dark: "gray.900"}}>
          <Spacer></Spacer>
          <SearchBar/>
          <Spacer p={2}></Spacer>
          <Separator w="100%" />
          <Heading fontWeight={"semibold"} size={"2xl"} textStyle={"5xl"} p={3}>
            <Highlight query={"movies"} styles={{fontWeight: "bold", color: "slateblue"}} > suggested movies </Highlight>
          </Heading>
          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
              lg:3
              }}
              gap="40px"
            >
          {movieDataList.map((movieData, idx) => (
            <MovieCard key={idx} movieData={movieData}/>
          ))}
          </SimpleGrid>
        </VStack>
      </Box>
    </Container>
  )
}

export default HomePage