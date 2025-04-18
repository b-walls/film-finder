"""Backend fastAPI for movie recommender application.

    Author: Brendan Walls
    Version: 4/13/2025 3:03:30
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
    new_genres = []
    for genre in genres:
        new_genres.append(genres_tmdb[genre])
    return new_genres


def get_top_providers(providers):
    new_providers = {}
    if 'flatrate' in providers:
        if len(providers['flatrate']) < 5:
            new_providers['stream'] = providers['flatrate'][:len(providers['flatrate'])]
        else:
            new_providers['stream'] = providers['flatrate'][:5]

    if 'rent' in providers:
        if len(providers['rent']) < 2:
            new_providers['rent'] = providers['rent'][:len(providers['rent'])]
        else:
            new_providers['rent'] = providers['rent'][:2]

    if 'buy' in providers:
        if len(providers['buy']) < 2:
            new_providers['buy'] = providers['buy'][:len(providers['buy'])]
        else:
            new_providers['buy'] = providers['buy'][:2]
    return new_providers


def get_useful_info(data):
    new_data = {}
    new_data['id'] = data['id']
    new_data['overview'] = data['overview']
    new_data['release_date'] = data['release_date']
    new_data['genres'] = parse_genres(data['genre_ids'])
    return new_data


def get_US_rating(results):
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

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

@app.get("/api/tmdb-data")
async def fetch_tmdb_data(imdb_id: str):
    print(TMDB_API_KEY)
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
        providers_US = providers['results']['US']
        data['providers'] = get_top_providers(providers_US)

        url_request_rating = f"https://api.themoviedb.org/3/movie/{tmdb_id}/release_dates"
        response = await client.get(url_request_rating, params=api_only_param)
        response = response.json()
        data['rating'] = get_US_rating(response['results'])

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
        print(index)
        _, indices = model.kneighbors([features[index]], )
        recommended = df.iloc[indices[0][1:]]["title"].tolist()
        return {"recommended": recommended}
    except KeyError:
        return {"error": "Movie title not found"}, 404


@app.get("/api/popular-titles")
async def get_popular_titles():
    movies = set()
    for _ in range(12):
        while True:
            movie = df['title'][randrange(0, 100)]
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
