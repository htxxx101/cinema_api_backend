from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

movie_data = {
    "Dune: Part One": {
        "show_time": "7:00 PM",
        "available_seats": 26
    },
    "Avatar: The Way of Water": {
        "show_time": "9:00 PM",
        "available_seats": 37
    },
    "Mission Impossible - Dead Reckoning Part One": {
        "show_time": "3:00 PM",
        "available_seats": 0
    },
    "James Bond: No Time to Die": {
        "show_time": "10:00 AM",
        "available_seats": 5
    },
    "Barbie": {
        "show_time": "1:00 PM",
        "available_seats": 50
    },
    "Oppenheimer": {
        "show_time": "6:30 PM",
        "available_seats": 15
    },
    "Spider-Man: Across the Spider-Verse": {
        "show_time": "4:00 PM",
        "available_seats": 30
    },
    "The Little Mermaid": {
        "show_time": "11:00 AM",
        "available_seats": 20
    }
}

@app.route('/')
def home():
    return "Welcome to the Cinema Ticket API! Use /api/v1/movies to get movie info."

@app.route('/api/v1/movies', methods=['GET'])
def get_movies():
    return jsonify(movie_data)

if __name__ == '__main__':
    # We'll rely on Gunicorn on Render, but this is good for local testing.
    # Render ignores the app.run() block and uses the gunicorn command.
    app.run(debug=True, host='0.0.0.0', port=5000)
