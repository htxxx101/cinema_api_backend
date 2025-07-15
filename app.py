from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#mock database for movie information
# This will be in-memory and reset every time the server restarts.
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
        "available_seats": 0 # Fully booked for demonstration
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
    """A simple home route to confirm the server is running."""
    return "Welcome to the Cinema Ticket API! Use /api/v1/movies to get movie info."

@app.route('/api/v1/movies', methods=['GET'])
def get_movies():
    """
    API endpoint to fetch all available movies, their showtimes, and available seats.
    Returns:
        JSON: A dictionary where keys are movie titles and values are their details.
    """
    return jsonify(movie_data)

@app.route('/api/v1/movies/<movie_title>/reserve', methods=['POST'])
def reserve_tickets(movie_title):
    """
    API endpoint to reserve tickets for a specific movie.
    Expects a JSON body with 'num_tickets':
    {
        "num_tickets": 3
    }
    """
    # 1. Validate incoming JSON data
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    num_tickets = data.get('num_tickets')

    if num_tickets is None or not isinstance(num_tickets, int) or num_tickets <= 0:
        return jsonify({"error": "Invalid number of tickets. Must be a positive integer."}), 400

    #  Normalize movie title for lookup (handle potential casing/spacing issues)
    #  try to find a matching movie title case-insensitively.
    found_movie_title = None
    for title_key in movie_data:
        if title_key.lower() == movie_title.lower():
            found_movie_title = title_key
            break
    
    if found_movie_title is None:
        return jsonify({"error": f"Movie '{movie_title}' not found."}), 404

    #  Process reservation
    movie_info = movie_data[found_movie_title]
    current_available_seats = movie_info["available_seats"]
    showtime = movie_info["show_time"]

    if current_available_seats < num_tickets:
        return jsonify({
            "message": f"Sorry, only {current_available_seats} seats left for '{found_movie_title}' at {showtime}. Cannot reserve {num_tickets} tickets.",
            "reserved": False,
            "movie_title": found_movie_title,
            "show_time": showtime,
            "available_seats": current_available_seats # Show current state
        }), 409 # 409 Conflict indicates a conflict with the current state of the resource

    # If enough seats, proceed with reservation
    movie_info["available_seats"] -= num_tickets
    new_available_seats = movie_info["available_seats"]

    return jsonify({
        "message": f"Successfully reserved {num_tickets} tickets for '{found_movie_title}' at {showtime}. Remaining seats: {new_available_seats}.",
        "reserved": True,
        "movie_title": found_movie_title,
        "show_time": showtime,
        "tickets_reserved": num_tickets,
        "remaining_seats": new_available_seats
    }), 200 # 200 OK for success

#run this file to start the Flask development server
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
