import { useState, useEffect } from "react";
import { EmptyState, VStack, IconButton, Box, Container, SimpleGrid, Heading, Separator, Highlight } from "@chakra-ui/react"

import { MdErrorOutline } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { useLocation, Link } from "react-router-dom"
import MovieCard from "@/components/MovieCard";


const RecommendPage = () => {
  const location = useLocation();
  const movie_query = new URLSearchParams(location.search).get("query");
  const [recommendations, setRecommendations] = useState([]);
  const [movieDataList, setMovieDataList] = useState([]); 

  const fetchRecommendations = async (movie_query) => {
      try {
        const response = await fetch(`/api/recommendations?title=${movie_query}`);
        const data = await response.json();
        setRecommendations(data.recommended || []);
      } catch (error) {
        setRecommendations([]);
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
      fetchRecommendations(movie_query);
  }, [movie_query]);

  useEffect(() => {
    if (recommendations.length > 0) {
      fetchAllMovies(recommendations);
    }
  }, [recommendations]);

  return (
    <Container spacing={10} p={5} justifyItems={"center"} borderLeftWidth={"1px"} borderRightWidth={"1px"}>
      <Heading fontWeight={"semibold"} alignContent={"center"} textStyle={"2xl"} p={1}>
        <Highlight query={`\"${movie_query}\"`} styles={{fontWeight: "bold", color: "slateblue"}} > 
          {`Recommendations based on \"${movie_query}\"`}
        </Highlight>
      </Heading>
      {recommendations.length > 0 ? (
        <SimpleGrid
        columns={{
          base: 1,
          md: 2,
          lg:3
          }}
          gap="40px"
          p={4}
        >
          {movieDataList.map((movieData, idx) => (
            <MovieCard key={idx} movieData={movieData}/>
          ))}
        </SimpleGrid>
      ) : (
        // empty result
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <MdErrorOutline />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>No results found</EmptyState.Title>
              <EmptyState.Description>
                Try adjusting your search
              </EmptyState.Description>
            </VStack>
            <Link to="/">
              <IconButton>
                <IoHome />
              </IconButton>
            </Link>
          </EmptyState.Content>
        </EmptyState.Root>
      )}
    </Container>
  );
}

export default RecommendPage