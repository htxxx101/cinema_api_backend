document.addEventListener('DOMContentLoaded', () => {
    // The base URL for your Flask API.
    // window.location.origin dynamically gets the current domain (e.g., https://cinema-api-backend-ksv9.onrender.com)
    // This is correct when the frontend is served by the same Flask app.
    const API_BASE_URL = window.location.origin; 
    
    // Get references to the HTML elements where we'll display content and status
    const movieGrid = document.getElementById('movieGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const headerTitle = document.querySelector('.header h1'); // To revert header on success

    // Asynchronous function to fetch movie data from the API
    async function fetchMovies() {
        // Show loading spinner and clear any previous error messages or movie content
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        if (errorMessage) errorMessage.style.display = 'none';
        if (movieGrid) movieGrid.innerHTML = ''; 

        try {
            // Attempt to fetch data from your API endpoint
            const response = await fetch(`${API_BASE_URL}/api/v1/movies`);

            // Check if the HTTP response was successful (status code 200-299)
            if (!response.ok) {
                // If not successful, throw an error with the status and response text
                const errorDetails = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorDetails.substring(0, 100)}...`); 
            }

            // Parse the JSON response into a JavaScript object
            const movies = await response.json();

            // Hide the loading spinner once data is received
            if (loadingSpinner) loadingSpinner.style.display = 'none';

            // Check if no movies were returned
            if (Object.keys(movies).length === 0) {
                if (movieGrid) movieGrid.innerHTML = '<p class="text-center text-gray-600 text-lg">No movies available.</p>';
                if (headerTitle) headerTitle.textContent = "No Movies Found.";
                return; // Exit the function if no movies
            }

            // Iterate over each movie in the fetched data and create a card for it
            for (const title in movies) {
                const movie = movies[title];
                const movieCard = document.createElement('div');
                movieCard.className = 'movie-card'; // Apply CSS class for styling

                // Determine seat availability text and corresponding CSS class
                const seatsClass = movie.available_seats > 0 ? 'seats-available' : 'seats-booked';
                const seatsText = movie.available_seats > 0 ? `${movie.available_seats} seats available` : 'Fully Booked';

                // Determine if a badge should be shown (e.g., Sold Out, Few Seats Left)
                let badgeHtml = '';
                if (movie.available_seats === 0) {
                    badgeHtml = '<span class="badge badge-sold-out">Sold Out</span>';
                } else if (movie.available_seats > 0 && movie.available_seats < 10) {
                    badgeHtml = '<span class="badge badge-new">Few Seats Left!</span>';
                }

                // Populate the movie card's HTML content
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
                // Add the created movie card to the movie grid
                if (movieGrid) movieGrid.appendChild(movieCard);
            }

            // On successful rendering, revert header and hide error message
            if (headerTitle) {
                headerTitle.textContent = `🌌 Meow Cinema 🍿`;
                headerTitle.style.color = "#fff"; // Assuming original color was white from CSS
                headerTitle.style.fontSize = "3.2rem";
            }
            if (errorMessage) errorMessage.style.display = 'none';

        } catch (error) {
            // If any error occurs during fetch or processing, hide spinner and display error message
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (errorMessage) {
                errorMessage.textContent = `❌ ERROR: ${error.message}. Please check your backend server.`;
                errorMessage.style.display = 'block';
            }
            if (headerTitle) {
                headerTitle.textContent = "🚫 Error Loading Movies 🚫";
                headerTitle.style.color = "#dc3545"; // Red for error
            }
            console.error('Error fetching movies:', error); // For debugging in a browser console if available
        }
    }

    // Call the fetchMovies function immediately when the page loads
    fetchMovies();

    // Set an interval to refresh movie data every 10 seconds
    setInterval(fetchMovies, 10000); 
});
