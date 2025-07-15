document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = window.location.origin; 
    
    const movieGrid = document.getElementById('movieGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');

    async function fetchMovies() {
        loadingSpinner.style.display = 'block'; // Show spinner
        errorMessage.style.display = 'none'; // Hide error
        movieGrid.innerHTML = ''; // Clear existing movies

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/movies`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const movies = await response.json();

            loadingSpinner.style.display = 'none'; // Hide spinner

            if (Object.keys(movies).length === 0) {
                movieGrid.innerHTML = '<p class="text-center text-gray-600 text-lg">No movies available.</p>';
                return;
            }

            for (const title in movies) {
                const movie = movies[title];
                const movieCard = document.createElement('div');
                movieCard.className = 'movie-card';

                const seatsClass = movie.available_seats > 0 ? 'seats-available' : 'seats-booked';
                const seatsText = movie.available_seats > 0 ? `${movie.available_seats} seats available` : 'Fully Booked';

                let badgeHtml = '';
                if (movie.available_seats === 0) {
                    badgeHtml = '<span class="badge badge-sold-out">Sold Out</span>';
                } else if (movie.available_seats < 10) {
                    badgeHtml = '<span class="badge badge-new">Few Seats Left!</span>';
                }

                movieCard.innerHTML = `
                    ${badgeHtml}
                    <div class="movie-card-content">
                        <h2 class="movie-title">${title}</h2>
                        <p class="movie-showtime">Showtime: ${movie.show_time}</p>
                    </div>
                    <div class="movie-footer">
                        <span class="seats-info ${seatsClass}">${seatsText}</span>
                    </div>
                `;
                movieGrid.appendChild(movieCard);
            }
        } catch (error) {
            loadingSpinner.style.display = 'none';
            errorMessage.textContent = `Failed to load movies: ${(error as Error).message}. Please ensure the backend is running.`;
            errorMessage.style.display = 'block';
            console.error('Error fetching movies:', error);
        }
    }

    fetchMovies();
    setInterval(fetchMovies, 10000); 
}); // <-- This closing brace was missing!
