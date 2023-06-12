// Get the genre list container
const genreList = document.querySelector(".genre-list");

// Function to fetch and process genre data
function fetchGenreData(genre) {
  fetch(`/api/movies/${genre.toLowerCase()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('No movies available for this genre');
      }
      return response.json();
    })
    .then(data => {
      const movieList = document.querySelector(".movie-list");

      // Clear the existing movie list
      movieList.innerHTML = "";
      
      if (data.length === 0) {
        const noMoviesMessage = document.createElement("p");
        noMoviesMessage.textContent = "No movies available for this genre yet.";
        movieList.appendChild(noMoviesMessage);
      } else {
        // Process the movie data and populate the movie list
        data.forEach(movie => {
          const movieCard = document.createElement("div");
          movieCard.classList.add("movie-card");

          const movieTitle = document.createElement("h2");
          movieTitle.classList.add("movie-title");
          movieTitle.textContent = movie.title;

          const movieVideo = document.createElement("iframe");
          movieVideo.classList.add("movie-video");
          movieVideo.src = movie.url;
          movieVideo.setAttribute("allowfullscreen", "");
          movieVideo.setAttribute("frameborder", "0");

          movieCard.appendChild(movieTitle);
          movieCard.appendChild(movieVideo);
          movieList.appendChild(movieCard);
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      const movieList = document.querySelector(".movie-list");
      movieList.innerHTML = "<p>An error occurred while fetching the movie data.</p>";
    });
}
