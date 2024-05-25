from flask import Flask, request, jsonify, send_from_directory
import requests
import os

app = Flask(__name__, static_folder='static')

OMDB_API_KEY = '6fbb5234'

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/search')
def search_movies():
    title = request.args.get('title')
    genre = request.args.get('genre')
    url = f'http://www.omdbapi.com/?s={title}&apikey={OMDB_API_KEY}'
    response = requests.get(url)
    data = response.json()

    if genre and 'Search' in data:
        filtered_results = []
        for movie in data['Search']:
            details_url = f'http://www.omdbapi.com/?i={movie["imdbID"]}&apikey={OMDB_API_KEY}'
            details_response = requests.get(details_url)
            movie_details = details_response.json()
            if genre.lower() in movie_details.get('Genre', '').lower():
                filtered_results.append(movie)
        data['Search'] = filtered_results

    return jsonify(data)

@app.route('/details')
def get_movie_details():
    imdb_id = request.args.get('imdbID')
    url = f'http://www.omdbapi.com/?i={imdb_id}&apikey={OMDB_API_KEY}'
    response = requests.get(url)
    return jsonify(response.json())

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True, port=5500)
