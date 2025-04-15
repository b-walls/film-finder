import { useState, useEffect } from "react";
import { EmptyState, VStack, IconButton, Text, Container, SimpleGrid, Heading, Separator } from "@chakra-ui/react"

import { MdErrorOutline } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { useLocation, Link } from "react-router-dom"
import MovieCard from "@/components/MovieCard";


const RecommendPage = () => {
  const location = useLocation();
  const movie_query = new URLSearchParams(location.search).get("query");
  const [recommendations, setRecommendations] = useState([]);
  const [movieDataList, setMovieDataList] = useState([]); // Store all movie data

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
      setMovieDataList(movieData); // Store all fetched movie data
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
    <Container spacing={10} p={5} justifyItems={"center"}>
      <Heading >{`Recommendations based on \"${movie_query}\"`}</Heading>
      {recommendations.length > 0 ? (
        <SimpleGrid
        columns={{
          base: 1,
          md: 2,
          lg:3
          }}
          gap="40px"
          p={10}
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