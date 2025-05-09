import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";

import { Input, List, Box, Separator, IconButton, Flex } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu"

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const fetchSuggestions = debounce(async (input) => {
    if (input.trim().length === 0) {
        setSuggestions([]);
        return;
    }
    const res = await axios.get(`${API_BASE}/api/search-title?query=${input}`);
    const titles = res.data.matches;
    setSuggestions(res.data.matches);
  }, 300);

  const handleChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    fetchSuggestions(input);
  };

  const handleSearch = () => {
    if (query.trim()) {
        navigate(`/recommendations?query=${encodeURIComponent(query)}`)
    }
  }

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [query]);

  return (
    <Box maxW="100vw" minW="100%" position={"relative"} px={20}>
      <Flex gap={2}>
        <Input
          placeholder="Search for movie suggestions..."
          value={query}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}/>
          <IconButton onClick={handleSearch} bg={"slateblue"}>
              <LuSearch/>
          </IconButton>
        </Flex>
        {Array.isArray(suggestions) && suggestions.length > 0 ? (
          <Box px={20} position={"absolute"} w={"100%"} zIndex="9999" left="0"> 
            <List.Root shadow={"md"} variant="plain" zIndex="1" mt={1} borderWidth={"1px"} rounded={"md"}>
              {suggestions.map((movie, idx) => (
                <List.Item bg={{base: "gray.100", _dark: "gray.900"}} 
                rounded={"sm"} 
                borderTopWidth="1px"
                key={idx} 
                px={4} 
                py={2} 
                cursor="pointer" 
                _hover={{bg: {base: "gray.200", _dark: "gray.950"}}}
                onClick={() => {
                  setQuery(movie)
                  setSuggestions([])}}>
                {movie}
              </List.Item>
              ))} 
            </List.Root>
          </Box>
            ) : null}
    </Box>
  );
};

export default SearchBar;