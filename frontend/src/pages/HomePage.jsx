import { React, useState, useEffect } from 'react'
import { VStack, Container, Heading, Separator, Spacer, Box, SimpleGrid, Highlight, Skeleton, SkeletonText } from '@chakra-ui/react'
import SearchBar from '@/components/SearchBar'
import MovieCard from '@/components/MovieCard'

const API_BASE = import.meta.env.VITE_BACKEND_URL;


const HomePage = () => {
  const [movieDataList, setMovieDataList] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  const fetchPopular = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setLoading(true);
    setApiError(false);
    try {
      const response = await fetch(`${API_BASE}/api/popular-titles`);
      const data = await response.json();
      setPopular(data.popular || []);
    } catch (error) {
      setPopular([]);
    } finally 
    {
      setLoading(false);
    }
  };

  const fetchAllMovies = async (movies) => {
    
    try {
      const movieDataPromises = movies.map(async (movie) => {
        const response = await fetch(`${API_BASE}/api/movie-data?title=${movie}`);
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
      <Box minH={"100vh"} bg={{base: "gray.100", _dark: "gray.900"}}>
        <VStack spacing={8} p={2} bg={{base: "gray.100", _dark: "gray.900"}}>
        {loading ? (
          <VStack py={5} spacing={5} w="100%" alignContent={"center"}>
            <Skeleton height="5" width="80%" mb={4}/>
            <Separator w="100%"/>
            <Heading fontWeight={"semibold"} size={"2xl"} textStyle={"5xl"} p={5}>
              <Highlight query={"AI"} styles={{fontWeight: "bold", color: "slateblue"}} > loading the AI </Highlight>
            </Heading>
            <SimpleGrid columns={{base: 1, md: 2, lg:3}} gap="40px">
              {Array(3).fill(null).map((_, idx) => (
                <Box
                  key={idx}
                  shadow="lg"
                  rounded="lg"
                  overflow="hidden"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
                  w="400px"
                  h="600px" // Example height
                >
                  <Skeleton height="xl" w="100%" loading={loading}/>
                </Box>
              ))} 
            </SimpleGrid>
          </VStack>
        ) : (
          <>
            <Spacer/>
            <SearchBar/>
            <Separator w="100%" mt={2}/> 
            <Heading fontWeight={"semibold"} size={"2xl"} textStyle={"5xl"} p={3}>
              <Highlight query={"movies"} styles={{fontWeight: "bold", color: "slateblue"}} > suggested movies </Highlight>
            </Heading>
            <SimpleGrid columns={{base: 1, md: 2, lg:3}} gap="40px">
              {movieDataList.map((movieData, idx) => (
                <MovieCard key={idx} movieData={movieData}/>
              ))}
            </SimpleGrid>
          </> 
          )}
        </VStack>
      </Box> 
    </Container>
  )
}

export default HomePage