document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = window.location.origin; 

    const movieGrid = document.getElementById('movieGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const headerTitle = document.querySelector('.header h1'); // Get the header title

    // Initial state confirmation
    if (headerTitle) {
        headerTitle.textContent = "Loading Movies..."; // Initial status
        headerTitle.style.color = "#0056b3"; // Revert to original color
        headerTitle.style.fontSize = "3.2rem"; // Revert to original size
    }

    async function fetchMovies() {
        loadingSpinner.style.display = 'block'; // Show spinner
        errorMessage.style.display = 'none'; // Hide previous error
        movieGrid.innerHTML = ''; // Clear existing movies

        try {
            if (headerTitle) headerTitle.textContent = "Fetching data..."; // Update status
            errorMessage.textContent = "Attempting to fetch movie data..."; // Show message in error div too

            const response = await fetch(`${API_BASE_URL}/api/v1/movies`);

            if (headerTitle) headerTitle.textContent = `Data Fetched. Status: ${response.status}`; // Update status
            errorMessage.textContent = `Fetch response received. Status: ${response.status}`;

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorDetails.substring(0, 100)}...`); // Show first 100 chars
            }

            const movies = await response.json();
            if (headerTitle) headerTitle.textContent = "Data Parsed. Rendering..."; // Update status
            errorMessage.textContent = `Movies data successfully parsed. Found ${Object.keys(movies).length} movies.`;

            loadingSpinner.style.display = 'none'; // Hide spinner

            if (Object.keys(movies).length === 0) {
                movieGrid.innerHTML = '<p class="text-center text-gray-600 text-lg">No movies available.</p>';
                if (headerTitle) headerTitle.textContent = "No Movies Found.";
                errorMessage.textContent = "API returned no movies.";
                return;
            }

            let moviesCount = 0;
            for (const title in movies) {
                moviesCount++;
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
            if (headerTitle) headerTitle.textContent = `🌌 Meow Cinema 🍿`; // Revert to original on success
            errorMessage.textContent = `Successfully rendered ${moviesCount} movies.`;
            errorMessage.style.display = 'none'; // Hide on success

        } catch (error) {
            loadingSpinner.style.display = 'none';
            errorMessage.textContent = `❌ ERROR: ${(error as Error).message}. Check API connection/response.`;
            errorMessage.style.display = 'block';
            if (headerTitle) headerTitle.textContent = "🚫 Error Loading Movies 🚫";
            if (headerTitle) headerTitle.style.color = "#dc3545"; // Red for error
        }
    }

    fetchMovies();
    setInterval(fetchMovies, 10000); 
});
