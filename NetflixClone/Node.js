const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
const axios = require('axios');

// Serve the CSS, JavaScript, and image files statically
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/html', express.static(path.join(__dirname, 'html')));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'Mainpage.html');
  res.sendFile(filePath);
});

// Define a route for genre-specific URLs
app.get('/genre-template/:genre', (req, res) => {
  const genre = req.params.genre;
  const filePath = path.join(__dirname, 'html', 'genre-template.html');

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(404).send('File Not Found');
    }

    const modifiedData = data.replace('{{genre}}', genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase());

    res.send(modifiedData);
  });
});



// Define a route for fetching movies from Google Drive
app.get('/api/movies/:genre', (req, res) => {
  const genre = req.params.genre;

  fetchMoviesFromGoogleDrive(genre)
    .then((movies) => {
      res.json(movies);
    })
    .catch((error) => {
      console.error('Error fetching movie data:', error);
      res.status(500).send('Internal Server Error');
    });
});

// ...

// Update the createDriveInstance function to remove the credentials parameter and use static values
function createDriveInstance() {
  return new Promise((resolve, reject) => {
    try {
      const credentials = {
        client_email: 'admin-817@netflixclone-388823.iam.gserviceaccount.com',
        private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCEG/Cri8tbJQLa\n5oqj1cVCDlrjkTK8DLYKKVJyx48Y3/kqdBELhkb94ksD8RkdcSGShjnOlUYhCVwj\ndmU4Fq1b4YCiXWQMadZejA/WIKfo9O/SwTj83OV2uVJTpQ1WtS+4x0EkN3O/e0r4\ngbiM7Sx+WASFt/uGWYgm08Tyw1ykaISLYiC9vOcccLT/LOtTL34fBsdAZVL90adc\nOCL1fPzyvxMNXi9+wUi+F7XFRzd76AtFPmEkBZiCeCAFxFysx/79WJDU22gLvX6y\nj0b6+5+HasqeqvEJkEETAlDoMzTMbLOZ2Ie4WiAf7hDcsMVT5piHWUWf0h6QIMcZ\n8VoyORMlAgMBAAECggEAC+tdbozhXyratBdi4N9Tud8Dsk6SbkcTUZ1i0/pPXeYv\nW/Y253xJAXUeYY+qPW7MoaS8qHftaOOoTYbMISBiqcyRx5R3h2sxLTyj3ST7IVig\nHrrSQnZHucuEswlMR8t3L8vCg9sA9YDRRdSmawinIAse9VWhOwDu+NnYhjK8NBUc\n2N32mCgmHsA3qpULcXQl+m51f3hmcq2T38CFRrRbjn8Itv3qQgx42/peBK8WR3JB\nhUcqgN2cj65HWQHTyUR57jO2ToAXTyeIbnGiIiKWLyvpawd6C7QhrVEzv3LY2f6z\nyptdQ8X8tZ5Jmjfoe8P9k4yqVb/x1DjqS1WX2vO4IQKBgQC4r+6uDkj1tjRMAJFS\nQRQZGy8RQN5eSpB5vHx86eHrDmkovKKjUMtEhbJhJ2oXIVH/Qk2w20Uz6Jl/CInh\nEieWtG7cK2c8x/SUyFlGL13/dtHgqsZzdVQUFFTmafaLr7CbamRmTP117aWc173G\n54u4DPX0i4e8tHpHwz50/igQ2QKBgQC3Hr0degnnJJZFdWB/+077nHrY8JhSCiU6\nuleM99YGjhxeK48HszujTtACGGHpegm7KFwyupxllYwQrSthy+JhJ7i3ugSxrvIE\noOkhZ/bMR2dnHpXdVqmmof0/hFDSo3FruvEKYXrdConyuGHtVgmvW9rbj2hnTk4c\ncYDAjXzlLQKBgGOABWsorw4R9+Lqe2CBRz6vcpAtDqBmM6gicD8sElb9EJKt7kFm\nidyE2zGUdoe3n+GR6yFZQNNSgT/7ba0ghsuesgtUJu6MG6z8s3wokM/NSA1udDRI\nBeA7g/IPLJDdOpzAmQ60c+lQ+2SgptG+dXvXH7t8YMi9wxNekQue0h8hAoGAWk9F\nk0D5m04W8kB2DAgjpsFAcLcPV/565+C4huQ/YFI7uVGgI3sIYXzf5vihaSTvoabA\n+Z/Au/Sp9BuDNqL3jVSqq6mI4RxXbWLyNrBwLcTVQSz7WgKAfpaLMAUQWyGSMUAr\n2iPDFTo6WEMIwKTa9+nEIN4z7ibXLP3pMo1U2C0CgYALmYzlUf3EBme0FtZF5Ole\nMYvW+uJLO5+fMg7+6zlrmPoJcuRS5pQhkZBRhkKv8FWovz31SsnRuvyugH82rYBH\n4wagBVMksE5grDpFYNHKZUpg3b/ma9sp1IlGrfUIMRQZoFL7DmFm3EDpeHCQeGFR\ncD1l9LSvT/SG5rOxUIA2Ug==\n-----END PRIVATE KEY-----\n` 
      };

      const jwtClient = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/drive.readonly']
      );

      jwtClient.authorize((err) => {
        if (err) {
          console.error('Error authenticating JWT client:', err);
          reject(err);
          return;
        }

        const drive = google.drive({ version: 'v3', auth: jwtClient });
        resolve(drive);
      });
    } catch (error) {
      console.error('Error creating JWT client:', error);
      reject(error);
    }
  });
}





function fetchMoviesFromGoogleDrive(genre) {
  return new Promise((resolve, reject) => {
    createDriveInstance()
      .then((drive) => {
        const imagesFolderId = '1IV1w0fq02RAi0nJjFgft0ElxnWqY3jzz';

        getGenreFolderId(genre, imagesFolderId, drive)
          .then((folderId) => {
            drive.files.list(
              {
                q: `'${folderId}' in parents`,
                fields: 'files(name, webContentLink)',
              },
              (err, response) => {
                if (err) {
                  console.error('Error listing files:', err);
                  reject(err);
                  return;
                }

                const movies = response.data.files.map((file) => {
                  const titleWithExtension = file.name;
                  const extension = titleWithExtension.split('.').pop().toLowerCase();
                  const title = titleWithExtension.replace(`.${extension}`, ''); // Remove the extension from the title
                  const encodedTitle = encodeURIComponent(title); // Encode the title to handle spaces in file names
                  const thumbnailExtension = (extension === 'mp4') ? 'jpeg' : extension; // Replace '.mp4' extension with '.jpeg' or keep the original extension
                  const thumbnail = file.webContentLink;

                  return {
                    title,
                    genre,
                    url: file.webContentLink,
                    thumbnail,
                  };
                });

                resolve(movies);
              }
            );
          })
          .catch((error) => {
            console.error('Error fetching genre folder ID:', error);
            reject(error);
          });
      })
      .catch((error) => {
        console.error('Error creating Drive instance:', error);
        reject(error);
      });
  });
}

app.get('/api/movies/images/:genre/:title', (req, res) => {
  const genre = req.params.genre;
  const title = decodeURIComponent(req.params.title);
  const filename = `${title}.jpeg`;

  createDriveInstance()
    .then((drive) => {
      const imagesFolderId = '1pkPNfJxIvvRYmyv-tgxN4Vt5b_Vi5xH-'; // Replace with the actual images folder ID

      getGenreFolderId(genre, imagesFolderId, drive)
        .then((folderId) => {
          drive.files.list(
            {
              q: `'${folderId}' in parents and name='${filename}'`,
              fields: 'files(id, webContentLink)',
            },
            (err, response) => {
              if (err) {
                console.error('Error listing files:', err);
                return res.status(500).send('Internal Server Error');
              }

              if (response.data.files.length === 0) {
                return res.status(404).send('File Not Found');
              }

              const file = response.data.files[0];

              // Declare and initialize the drive variable here
              const imageStream = drive.files.get(
                { fileId: file.id, alt: 'media' },
                { responseType: 'stream' },
                (err, response) => {
                  if (err) {
                    console.error('Error retrieving image:', err);
                    return res.status(500).send('Internal Server Error');
                  }
                  res.setHeader('Content-Type', 'image/jpeg');
                  response.data.pipe(res);
                }
              );

              if (imageStream && imageStream.on) {
                imageStream.on('error', (err) => {
                  console.error('Error reading image stream:', err);
                  return res.status(500).send('Internal Server Error');
                });
              }
            }
          );
        })
        .catch((error) => {
          console.error('Error fetching genre folder ID:', error);
          return res.status(500).send('Internal Server Error');
        });
    })
    .catch((error) => {
      console.error('Error creating Drive instance:', error);
      return res.status(500).send('Internal Server Error');
    });
});



// Get the ID of the genre-specific folder
function getGenreFolderId(genre, moviesFolderId, drive) {
  return new Promise((resolve, reject) => {
    drive.files.list(
      {
        q: `name='${genre}' and '${moviesFolderId}' in parents`,
        fields: 'files(id)',
      },
      (err, response) => {
        if (err) {
          console.error('Error listing genre folders:', err);
          reject(err);
          return;
        }

        if (response.data.files.length === 0) {
          reject(new Error(`Genre folder not found for '${genre}'.`));
          return;
        }

        const folderId = response.data.files[0].id;
        resolve(folderId);
      }
    );
  });
}

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
