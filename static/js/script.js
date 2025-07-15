document.addEventListener('DOMContentLoaded', () => {
    // Find the header element
    const header = document.querySelector('.header h1'); 
    if (header) {
        header.textContent = "✅ Script is Running! ✅"; // Change the text directly
        header.style.color = "#FFD700"; // Change its color to gold
        header.style.fontSize = "4rem"; // Make it bigger
    } else {
        // If header isn't found, try to alert anyway (though alerts aren't working for you)
        // alert("Header element not found!"); 
    }

    // Remove the loading spinner, as we won't fetch anything
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
});
