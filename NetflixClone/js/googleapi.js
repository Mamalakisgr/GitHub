// Import the Axios library
const axios = require('axios');

// Define a route for fetching movies from Google Drive
app.get('/api/movies', (req, res) => {
  const genre = req.query.genre;
  const apiKey = 'AIzaSyC5WJVue85grCPrzDdyP2x0uQ3hMqW_ci4'; // Replace 'YOUR_API_KEY' with your actual API key

  // Make a GET request to the Google Drive API
  axios.get('https://www.googleapis.com/drive/v3/files', {
    params: {
      q: `'${genre}' in parents`,
      key: apiKey,
    },
  })
    .then(response => {
      // Extract relevant movie information from the API response
      const movies = response.data.files.map(file => {
        return {
          title: file.name,
          // Add other movie details as needed
        };
      });
      res.json(movies);
    })
    .catch(error => {
      console.error('Error calling Google Drive API:', error);
      res.status(500).send('Internal Server Error');
    });
});
