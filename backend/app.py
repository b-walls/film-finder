import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


# load model
with open('./data/model.pkl', 'rb') as f:
    model = pickle.load(f)

# load data
df = pd.read_csv("./data/indexed_movies.csv")
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
@app.get("/recommendations")
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
        distances, indices = model.kneighbors([features[index]])
        recommended = df.iloc[indices[0][1:]]["title"].tolist()
        return {"recommended": recommended}
    except KeyError:
        return {"error": "Movie title not found"}, 404
