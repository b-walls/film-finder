"""Backend fastAPI for movie recommender application.

    Author: Brendan Walls
    Version: 4/13/2025 3:03:30
"""
import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from thefuzz import process, fuzz
from random import randrange


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

# request recommendation
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
    for _ in range(3):
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
    imdb_id = "https://www.imdb.com/title/" + movie_info['imdb_id'].iloc[0]
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
