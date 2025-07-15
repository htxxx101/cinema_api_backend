from flask import Flask, jsonify, request, render_template
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
def serve_frontend():
    return render_template('index.html')

@app.route('/api/v1/movies', methods=['GET'])
def get_movies():
    return jsonify(movie_data)

@app.route('/api/v1/movies/<movie_title>/reserve', methods=['POST'])
def reserve_tickets(movie_title):
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    num_tickets = data.get('num_tickets')

    if num_tickets is None or not isinstance(num_tickets, int) or num_tickets <= 0:
        return jsonify({"error": "Invalid number of tickets. Must be a positive integer."}), 400

    found_movie_title = None
    for title_key in movie_data:
        if title_key.lower() == movie_title.lower():
            found_movie_title = title_key
            break
    
    if found_movie_title is None:
        return jsonify({"error": f"Movie '{movie_title}' not found."}), 404

    movie_info = movie_data[found_movie_title]
    current_available_seats = movie_info["available_seats"]
    showtime = movie_info["show_time"]

    if current_available_seats < num_tickets:
        return jsonify({
            "message": f"Sorry, only {current_available_seats} seats left for '{found_movie_title}' at {showtime}. Cannot reserve {num_tickets} tickets.",
            "reserved": False,
            "movie_title": found_movie_title,
            "show_time": showtime,
            "available_seats": current_available_seats
        }), 409

    movie_info["available_seats"] -= num_tickets
    new_available_seats = movie_info["available_seats"]

    return jsonify({
        "message": f"Successfully reserved {num_tickets} tickets for '{found_movie_title}' at {showtime}. Remaining seats: {new_available_seats}.",
        "reserved": True,
        "movie_title": found_movie_title,
        "show_time": showtime,
        "tickets_reserved": num_tickets,
        "remaining_seats": new_available_seats
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
