document.addEventListener('DOMContentLoaded', () => {
    alert("1. Script started and DOM loaded."); // Debug Alert 1

    const API_BASE_URL = window.location.origin; 
    
    const movieGrid = document.getElementById('movieGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');

    // Debug: Check if elements are found (they should be if HTML is correct)
    if (!movieGrid) alert("Error: movieGrid element not found!");
    if (!loadingSpinner) alert("Error: loadingSpinner element not found!");
    if (!errorMessage) alert("Error: errorMessage element not found!");

    async function fetchMovies() {
        alert("2. fetchMovies function called."); // Debug Alert 2

        loadingSpinner.style.display = 'block'; // Show spinner
        errorMessage.style.display = 'none'; // Hide error
        movieGrid.innerHTML = ''; // Clear existing movies

        try {
            alert(`3. Attempting to fetch from: ${API_BASE_URL}/api/v1/movies`); // Debug Alert 3
            const response = await fetch(`${API_BASE_URL}/api/v1/movies`);

            alert(`4. Fetch response received. Status: ${response.status}`); // Debug Alert 4

            if (!response.ok) {
                const errorText = await response.text(); // Try to get more info
                throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorText}`);
            }

            const movies = await response.json();
            alert("5. Movies data successfully parsed."); // Debug Alert 5
            
            // Debug: Check if movies data is actually an object with keys
            alert("Movies data type: " + typeof movies + ", Has keys: " + Object.keys(movies).length); // Debug Alert 6

            loadingSpinner.style.display = 'none'; // Hide spinner

            if (Object.keys(movies).length === 0) {
                movieGrid.innerHTML = '<p class="text-center text-gray-600 text-lg">No movies available.</p>';
                alert("6. No movies available message displayed."); // Debug Alert 7
                return;
            }

            let moviesCount = 0; // Debug counter
            for (const title in movies) {
                moviesCount++; // Increment counter
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
            alert(`7. Successfully rendered ${moviesCount} movies.`); // Debug Alert 8

        } catch (error) {
            loadingSpinner.style.display = 'none';
            errorMessage.textContent = `Failed to load movies: ${(error as Error).message}. Please ensure the backend is running.`;
            errorMessage.style.display = 'block';
            alert(`X. Caught an error: ${(error as Error).message}`); // Debug Alert X
            console.error('Error fetching movies:', error); // This would show in browser console
        }
    }

    fetchMovies();
    setInterval(fetchMovies, 10000); 
});
