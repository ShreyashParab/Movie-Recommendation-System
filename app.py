
from flask import Flask, request, jsonify, render_template
from movieModel import get_recommend
from movieModel import get_random_movie
from movieModel import get_random_movie_by_genre
from movieModel import get_movie_titles
from movieModel import get_top_10_movies
from movieModel import get_top_10_popular_movies
from movieModel import get_top_10_movies_by_genre
# from movieModel import get_similar_movies
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recommends', methods=['GET'])
def recommend():
    movie = request.args.get('movie')
    if movie:
        recommendations = get_recommend(movie)
        return jsonify(recommendations)
    else:
        return jsonify({"error": "No movie title provided"}), 400

@app.route('/random_movie', methods=['GET'])
def random_movie():
    movie_data = get_random_movie()
    
    return jsonify(movie_data)

@app.route('/random_movie_by_genre', methods=['GET'])
def random_movie_by_genre():
    genre = request.args.get('genre')
    # genre = 'action'
    if genre:
        # return jsonify(get_random_movie_by_genre(genre))
        random_movie_genre_data = get_random_movie_by_genre(genre)
        return jsonify(random_movie_genre_data)
    else:
        return jsonify({"error": "No genre provided"}), 400
    
@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('query', '')
    if query:
        titles = get_movie_titles(query)
        return jsonify(titles)
    else:
        return jsonify([])

@app.route('/top_10_movies', methods=['GET'])
def top_10_movies():
    # return jsonify(get_top_10_movies())
    trending = get_top_10_movies()
    # print(trending)
    return jsonify(trending)



@app.route('/movie_details', methods=['GET'])
def movie_details():
    movie_title = request.args.get('title')
    # print(movie_title)
    similar_movies = get_recommend(movie_title)
    similar_movies = similar_movies[:4]
    # print(similar_movies)
    return render_template('movie_details.html',similar_movies=similar_movies)

@app.route('/favourites')
def favourites():
    return render_template('favourites.html')


@app.route('/top_genres')
def top_genres():
    return render_template('top_genres.html')


@app.route('/top_10_popular_movies', methods=['GET'])
def top_10_popular_movies():
    # return jsonify(get_top_10_movies())
    popular = get_top_10_popular_movies()
    # print(popular)
    return jsonify(popular)

# top_10_popular_movies()

@app.route('/api/top_movies_by_genre/<genre>', methods=['GET'])
def top_movies_by_genre(genre):
    top_movies = get_top_10_movies_by_genre(genre)
    return jsonify(top_movies)


if __name__ == '__main__':
    app.run(debug=True)



