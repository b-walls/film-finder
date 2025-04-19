import {React, useState, useEffect} from 'react'
import { Box, Image, Text, Heading, HStack, Flex, IconButton, Link, RatingGroup, VStack } from '@chakra-ui/react'
import { LuExternalLink } from "react-icons/lu"
import { useNavigate } from "react-router-dom";
import MovieInfoDialog from './MovieInfoDialog';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const MovieCard = ({ movieData, isHome }) => {
  const [tmdbInfo, setTmdbInfo] = useState([]);
  const navigate = useNavigate();

  const fetchTmdbInfo = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/tmdb-data?imdb_id=${movieData.imdb_id}`)
        const data = await response.json();
        setTmdbInfo(data);
      } catch (error) {
        console.log(`Error fetching TMDB info for ${movieData.title}`, error);
      }
    }
  
    useEffect(() => {
      fetchTmdbInfo();
    }, []);


  const handleSearch = () => {
    navigate(`/recommendations?query=${encodeURIComponent(movieData.title)}`)
  }
  
  return isHome ? (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      w="100%"
    >
      <Image
        src={movieData.poster}
        alt={movieData.title}
        w="100%"
        h="600px"
        cursor="pointer"
        onClick={handleSearch}
      />
      <Box p={4}>
        <Flex justifyContent={"space-between"}>
          <Heading as="h3" size="md" mb={2}>
            {movieData.title}
          </Heading>
          <HStack>
            <RatingGroup.Root
              disabled
              allowHalf
              count={5}
              defaultValue={Math.floor(movieData.rating + 0.5) / 2}
              size="sm"
              colorPalette={"yellow"}
            >
              <RatingGroup.HiddenInput />
              <RatingGroup.Control/>
            </RatingGroup.Root>
          </HStack>
        </Flex>
      </Box>
    </Box>
  ) : (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      w="100%"
    >
      <MovieInfoDialog movieData={movieData} tmdbInfo={tmdbInfo}>
        <Image
          src={movieData.poster}
          alt={movieData.title}
          w="100%"
          h="600px"
          cursor="pointer"
        />
      </MovieInfoDialog>
      <Box py={4} px={4}>
      <Flex justifyContent={"space-between"}>
          <Heading as="h3" size="md" mb={2}>
            {movieData.title}
          </Heading>
          <HStack>
            <RatingGroup.Root
              disabled
              allowHalf
              count={5}
              defaultValue={Math.floor(movieData.rating + 0.5) / 2}
              size="sm"
              colorPalette={"yellow"}
            >
              <RatingGroup.HiddenInput />
              <RatingGroup.Control/>
            </RatingGroup.Root>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};

export default MovieCard