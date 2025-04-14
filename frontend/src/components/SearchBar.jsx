import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";

import { Input, List, Box, Separator, IconButton, Flex } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu"


const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const fetchSuggestions = debounce(async (input) => {
    if (input.trim().length === 0) {
        setSuggestions([]);
        return;
    }
    const res = await axios.get(`/api/search-title?query=${input}`);
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

  return (
    <Box minW="xl">
        <Flex gap={2}>
            <Input
                placeholder="Search for a movie..."
                value={query}
                onChange={handleChange}
            />
            <IconButton onClick={handleSearch}>
                <LuSearch/>
            </IconButton>
        </Flex>
        {Array.isArray(suggestions) && suggestions.length > 0 ? (
        <List.Root variant="plain" zIndex="1" width="100%" mt={1}>
            {suggestions.map((movie, idx) => (
            <List.Item key={idx} px={4} py={2} cursor="pointer" _hover={{bg: {base: "gray.200", _dark: "gray.950"}}}
            onClick={() => {
                setQuery(movie)
                setSuggestions([])}}>
                {movie}<Separator/>
            </List.Item>
            ))}
            
        </List.Root>
        ) : null}
    </Box>
  );
};

export default SearchBar;