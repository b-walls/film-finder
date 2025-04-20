"""Backend fastAPI for movie recommender application.

This module provides a FastAPI backend for a movie recommender system. It includes
endpoints for fetching movie data, generating recommendations, retrieving popular
titles, and searching for movies by title. The application integrates with The Movie
Database (TMDb) API to fetch detailed movie information, including streaming providers
and ratings.

Modules:
    - random: Used for generating random numbers.
    - pickle: Used for loading the pre-trained recommendation model.
    - os: Used for accessing environment variables.
    - dotenv: Used for loading environment variables from a .env file.
    - numpy: Used for numerical operations.
    - pandas: Used for data manipulation and analysis.
    - fastapi: Used for building the web API.
    - fastapi.middleware.cors: Used for enabling Cross-Origin Resource Sharing (CORS).
    - thefuzz: Used for fuzzy string matching.
    - httpx: Used for making asynchronous HTTP requests.
Global Variables:
    - genres_tmdb (dict): A mapping of TMDb genre IDs to their corresponding genre names.
    - model: The pre-trained recommendation model loaded from a pickle file.
    - df (DataFrame): A pandas DataFrame containing movie data.
    - title_to_index (dict): A mapping of movie titles to their corresponding indices in the DataFrame.
    - features (ndarray): A NumPy array containing feature vectors for the movies.
    - TMDB_API_KEY (str): The API key for accessing TMDb API.
Endpoints:
    - /api/tmdb-data: Fetches movie data from TMDb API using an IMDb ID.
    - /api/recommendations: Recommends movies based on a provided title.
    - /api/popular-titles: Retrieves a list of popular movie titles.
    - /api/movie-data: Fetches movie data (poster path, IMDb ID) based on a movie title.
    - /api/search-title: Searches for movie titles based on a query.
Utility Functions:
    - parse_genres: Converts a list of genre names into their corresponding TMDb genre IDs.
    - get_top_providers: Filters and limits the number of providers in each category (stream, rent, buy).
    - get_useful_info: Extracts and transforms useful information from a movie data dictionary.
    - get_US_rating: Extracts the US movie rating from a list of release date results.

    Author: Brendan Walls
"""


from random import randrange
import pickle
import os

from dotenv import load_dotenv
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from thefuzz import process, fuzz
import httpx


genres_tmdb = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
}

def parse_genres(genres):
    """
    Converts a list of genre names into their corresponding TMDB genre IDs.

    Args:
        genres (list of str): A list of genre names to be converted.

    Returns:
        list of int: A list of TMDB genre IDs corresponding to the input genre names.

    Note:
        The function assumes that `genres_tmdb` is a predefined dictionary
        mapping genre names (str) to their TMDB genre IDs (int).
    """
    new_genres = []
    for genre in genres:
        new_genres.append(genres_tmdb[genre])
    return new_genres


def get_top_providers(providers):
    """
    Filters and limits the number of providers in each category (stream, rent, buy).
    Args:
        providers (dict): A dictionary containing provider categories as keys 
                          ('flatrate', 'rent', 'buy') and lists of providers as values.
    Returns:
        dict: A dictionary with the top providers in each category:
              - 'stream': Up to 5 providers from the 'flatrate' category.
              - 'rent': Up to 2 providers from the 'rent' category.
              - 'buy': Up to 2 providers from the 'buy' category.
    """
    new_providers = {}
    if 'flatrate' in providers:
        if len(providers['flatrate']) < 5:
            new_providers['stream'] = providers['flatrate'][:len(providers['flatrate'])]
        else:
            new_providers['stream'] = providers['flatrate'][:5]

    if 'rent' in providers:
        if len(providers['rent']) < 4:
            new_providers['rent'] = providers['rent'][:len(providers['rent'])]
        else:
            new_providers['rent'] = providers['rent'][:4]

    if 'buy' in providers:
        if len(providers['buy']) < 4:
            new_providers['buy'] = providers['buy'][:len(providers['buy'])]
        else:
            new_providers['buy'] = providers['buy'][:4]

    if 'link' in providers:
        new_providers['link'] = providers['link']

    return new_providers


def get_useful_info(data):
    """
    Extracts and transforms useful information from a movie data dictionary.

    Args:
        data (dict): A dictionary containing movie information. Expected keys include:
            - 'id' (int): The unique identifier for the movie.
            - 'overview' (str): A brief summary of the movie.
            - 'release_date' (str): The release date of the movie in 'YYYY-MM-DD' format.
            - 'genre_ids' (list): A list of genre IDs associated with the movie.

    Returns:
        dict: A dictionary containing the following keys:
            - 'id' (int): The unique identifier for the movie.
            - 'overview' (str): A brief summary of the movie.
            - 'release_date' (str): The release date of the movie.
            - 'genres' (list): A list of genre names derived from the genre IDs.
    """
    new_data = {}
    new_data['id'] = data['id']
    new_data['overview'] = data['overview']
    new_data['release_date'] = data['release_date']
    new_data['genres'] = parse_genres(data['genre_ids'])
    return new_data


def get_us_rating(results):
    """
    Extracts the US movie rating from a list of release date results.

    Args:
        results (list): A list of dictionaries containing release date information. 
                        Each dictionary should have the keys 'iso_3166_1' and 'release_dates'.

    Returns:
        str: The US movie rating (certification) if found, otherwise "No rating found".
    """
    for result in results:
        if 'iso_3166_1' in result and result['iso_3166_1'] == "US":
            return result['release_dates'][0]['certification']
    return "No rating found"


# load model
with open('./data/model.pkl', 'rb') as f:
    model = pickle.load(f)

# load data
df = pd.read_csv("./data/indexed_movies.csv")
df['title'] = df['title'].str.replace("&", "and")
title_to_index = {title: idx for idx, title in enumerate(df["title"])}
features = np.load("./data/features.npy")

# startup app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# get env variables
load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

@app.get("/api/tmdb-data")
async def fetch_tmdb_data(imdb_id: str):
    """
    Fetches movie data from The Movie Database (TMDb) API using an IMDb ID.
    This function retrieves detailed movie information, including TMDb ID, 
    streaming providers available in the US, and the movie's rating in the US.
    Args:
        imdb_id (str): The IMDb ID of the movie to fetch data for.
    Returns:
        dict: A dictionary containing the following keys:
            - 'id': The TMDb ID of the movie.
            - 'title': The title of the movie.
            - 'overview': A brief description of the movie.
            - 'release_date': The release date of the movie.
            - 'providers': A list of top streaming providers available in the US.
            - 'rating': The movie's rating in the US.
    Raises:
        httpx.HTTPStatusError: If the HTTP request to the TMDb API fails.
        KeyError: If the expected data structure is not found in the API response.
    """
    url_request_id = f"https://api.themoviedb.org/3/find/{imdb_id}"
    request_id_params={"api_key": TMDB_API_KEY, "external_source": "imdb_id"}
    api_only_param={"api_key": TMDB_API_KEY}

    async with httpx.AsyncClient() as client:
        response = await client.get(url_request_id, params=request_id_params)
        response.raise_for_status()
        data = response.json()
        data = data['movie_results'][0]
        tmdb_id = data['id']
        data = get_useful_info(data)

        url_request_providers = f"https://api.themoviedb.org/3/movie/{tmdb_id}/watch/providers"
        response = await client.get(url_request_providers, params=api_only_param)
        response.raise_for_status()
        providers = response.json()
        providers_us = providers['results']['US']
        data['providers'] = get_top_providers(providers_us)

        url_request_rating = f"https://api.themoviedb.org/3/movie/{tmdb_id}/release_dates"
        response = await client.get(url_request_rating, params=api_only_param)
        response = response.json()
        data['rating'] = get_us_rating(response['results'])

        return data


@app.get("/api/recommendations")
async def recommend(title: str):
    """
    Recommend movies based on the provided title.

    Args:
        title (str): The title of the movie to base recommendations on.

    Returns:
        dict: A dictionary containing the recommended movie titles or an error message.
    """
    if not isinstance(title, str) or not title.strip():
        return {"error": "Invalid input: title must be a non-empty string"}, 400

    try:
        index = title_to_index[title]
        _, indices = model.kneighbors([features[index]], )
        recommended = df.iloc[indices[0][1:]]["title"].tolist()
        return {"recommended": recommended}
    except KeyError:
        return {"error": "Movie title not found"}, 404


@app.get("/api/popular-titles")
async def get_popular_titles():
    """
    Asynchronously retrieves a list of popular movie titles.

    This function selects 12 unique movie titles randomly from a DataFrame
    and returns them as a list. It ensures that there are no duplicate titles
    in the result.

    Returns:
        dict: A dictionary containing a key "popular" with a list of 12 unique
        movie titles as its value.
    """
    movies = set()
    for _ in range(12):
        while True:
            movie = df['title'][randrange(0, 200)]
            if movie in movies:
                continue
            movies.add(movie)
            break
    return{"popular": list(movies)}


@app.get("/api/movie-data")
async def movie_data(title: str):
    """
    Gets movie data (poster_path, imdb_id) from movie title

    Args:
        title (str): The title of the movie 

    Returns:
        dict: A dictionary containing poster_path path and imdb_id
    """
    movie_info = df[df['title'] == title]
    if len(movie_info) == 0:
        return {"error": "Movie title not found"}, 404

    poster_path = "https://image.tmdb.org/t/p/w500" + movie_info['poster_path'].iloc[0]
    imdb_id = movie_info['imdb_id'].iloc[0]
    rating = movie_info['vote_average'].iloc[0]

    return {"title": title, "poster": poster_path, "imdb_id": imdb_id, "rating": rating}


@app.get("/api/search-title")
async def search_movies(query: str):
    """
    Gets the list of movie titles available for model inference

    Args:
        query (str): The search query

    Returns:
        dict: A dictionary containing all movie titles
    """
    matches = process.extract(query, df['title'], scorer=fuzz.partial_token_sort_ratio)
    matches = [match for match, sim, idx in matches]
    return {"matches": matches}
