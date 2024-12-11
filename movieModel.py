import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import ast
import random
from datetime import datetime
import requests

credits = pd.read_csv('tmdb_5000_credits.csv')
movies = pd.read_csv('tmdb_5000_movies.csv')

# Merge datasets on 'title'
movies = movies.merge(credits, on='title')

# Select relevant columns
movies = movies[['movie_id', 'title', 'overview', 'genres', 'keywords', 'cast', 'crew', 'vote_average','popularity']]

# Drop rows with missing values
movies.dropna(inplace=True)

# Normalize the movie titles to lowercase
movies['title'] = movies['title'].str.lower()

# Function to convert JSON formatted string to list of names
def convert(text):
    L = []
    for i in ast.literal_eval(text):
        L.append(i['name'].strip().lower())  # Normalize to lowercase and strip spaces
    return L

# Apply the conversion function to the relevant columns
movies['genres'] = movies['genres'].apply(convert)
movies['keywords'] = movies['keywords'].apply(convert)

# Function to get top 3 cast members
def convert3(text):
    L = []
    counter = 0
    for i in ast.literal_eval(text):
        if counter < 3:
            L.append(i['name'].strip().lower())  # Normalize to lowercase and strip spaces
        counter += 1
    return L

movies['cast'] = movies['cast'].apply(convert3)

# Function to get director from the crew
def fetch_director(text):
    L = []
    for i in ast.literal_eval(text):
        if i['job'] == 'Director':
            L.append(i['name'].strip().lower())  # Normalize to lowercase and strip spaces
    return L

movies['crew'] = movies['crew'].apply(fetch_director)

# Remove spaces in names and join them with a space
def collapse(L):
    L1 = []
    for i in L:
        L1.append(i.replace(" ", ""))
    return L1

movies['cast'] = movies['cast'].apply(collapse)
movies['crew'] = movies['crew'].apply(collapse)
movies['genres'] = movies['genres'].apply(collapse)
movies['keywords'] = movies['keywords'].apply(collapse)

# Create a 'tags' column by combining relevant columns
movies['overview'] = movies['overview'].apply(lambda x: x.split())
movies['tags'] = movies['overview'] + movies['genres'] + movies['keywords'] + movies['cast'] + movies['crew']

# Create a new DataFrame with only the relevant columns
new = movies[['movie_id', 'title', 'tags']]

# Join the tags into a single string
new['tags'] = new['tags'].apply(lambda x: " ".join(x))

# Create the CountVectorizer and transform the tags into a vector
cv = CountVectorizer(max_features=5000, stop_words='english')
vector = cv.fit_transform(new['tags']).toarray()

# Compute the cosine similarity matrix
similarity = cosine_similarity(vector)

# Function to get movie recommendations
def get_recommend(movie):
    movie = movie.lower()
    if movie not in new['title'].values:
        return ["Movie not found"]
    index = new[new['title'] == movie].index[0]
    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
    recommendations = [new.iloc[i[0]].title for i in distances[1:10]]
    movie_details = []
    for movie in recommendations:
        url = f'http://www.omdbapi.com/?t={movie}&apikey=8dcb5239'
        response = requests.get(url)
        if response.status_code == 200:
            movie_data = response.json()
            if movie_data['Response'] == 'True':
                movie_details.append({
                    'title': movie_data['Title'],
                    'poster': movie_data['Poster'],
                    'year': movie_data['Year'],
                    'plot': movie_data['Plot']
                })
    # print(movie_details)
    return movie_details
    # return recommendations

# Function to get a random movie of the day
def get_random_movie():
    random_movie = movies.sample(1)['title'].iloc[0]
    
    # Make a request to OMDB API to get details including poster
    omdb_url = f'http://www.omdbapi.com/?apikey=8dcb5239&t={random_movie}'
    response = requests.get(omdb_url)
    data = response.json()
    # Extract title and poster URL from OMDB API response
    movie_data = {
        'title': data.get('Title', 'Title not found'),
        'poster': data.get('Poster', 'Poster not found')
    }
        
    return movie_data

# Function to get a random high-rated movie by genre
def get_random_movie_by_genre(genre):
    genre = genre.strip().lower()  # Normalize the selected genre
    # print(genre)
    # genre = 'action'
    # Filter the movies based on the selected genre
    filtered_movies = movies[movies['genres'].apply(lambda x: genre in x)]
    high_rated_movies = filtered_movies.sort_values(by='vote_average', ascending=False).head(50)
    random_movie_genre = high_rated_movies.sample(1)[['title']].iloc[0].to_dict()
    print(random_movie_genre)
    title = random_movie_genre['title']
    # print(title)
    omdb_url = f'http://www.omdbapi.com/?t={title}&apikey=8dcb5239'
    response = requests.get(omdb_url)
    data = response.json()
    # Extract title and poster URL from OMDB API response
    random_movie_genre_data = {
        'title': data.get('Title', 'Title not found'),
        'poster': data.get('Poster', 'Poster not found')
    }
    return random_movie_genre_data
    # print(random_movie_genre_data)


def get_movie_titles(query):
    query = query.lower()
    matched_titles = movies[movies['title'].str.contains(query)]['title'].tolist()
    return matched_titles

def get_top_10_movies():
    # Sort movies by vote_count and get top 10
    top_10 = movies.sort_values(by='vote_average', ascending=False).head(10)
    top_10_details = []

    for _, row in top_10.iterrows():
        title = row['title']
        omdb_url = f'http://www.omdbapi.com/?t={title}&apikey=8dcb5239'
        response = requests.get(omdb_url)
        if response.status_code == 200:
            movie_data = response.json()
            if movie_data['Response'] == 'True':
                top_10_details.append({
                    'title': movie_data['Title'],
                    'poster': movie_data['Poster']
                })
    # print(top_10_details)
    return top_10_details

def get_top_10_popular_movies():
    # Sort movies by vote_count and get top 10
    top_10_popular = movies.sort_values(by='popularity', ascending=False).head(15)
    top_10_popular_details = []

    for _, row in top_10_popular.iterrows():
        title = row['title']
        omdb_url = f'http://www.omdbapi.com/?t={title}&apikey=8dcb5239'
        response = requests.get(omdb_url)
        if response.status_code == 200:
            movie_data = response.json()
            if movie_data['Response'] == 'True':
                top_10_popular_details.append({
                    'title': movie_data['Title'],
                    'poster': movie_data['Poster']
                })
    # print(top_10_details)
    return top_10_popular_details


def get_top_10_movies_by_genre(genre):
    genre = genre.strip().lower()
    filtered_movies = movies[movies['genres'].apply(lambda x: genre in x)]
    top_10 = filtered_movies.sort_values(by='popularity', ascending=False).head(15)
    top_10_details = []

    for _, row in top_10.iterrows():
        title = row['title']
        omdb_url = f'http://www.omdbapi.com/?t={title}&apikey=8dcb5239'
        response = requests.get(omdb_url)
        if response.status_code == 200:
            movie_data = response.json()
            if movie_data['Response'] == 'True':
                top_10_details.append({
                    'title': movie_data['Title'],
                    'poster': movie_data['Poster']
                })
    return top_10_details


