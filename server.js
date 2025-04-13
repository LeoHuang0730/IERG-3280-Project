const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Storage configuration for uploaded images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  },
});

// Storage configuration for uploaded videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/videos');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  },
});

// Create instances of the multer middleware for images and videos
const imageUpload = multer({ storage: imageStorage });
const videoUpload = multer({ storage: videoStorage });

// Serve static files from the "public" directory
app.use(express.static('public'));

// Route for uploading images
app.post('/upload', imageUpload.single('image'), (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Image Upload</title>
        <script>
          window.onload = function() {
            alert('Image Uploaded Successfully');
            window.location.href = 'ImageUpload.html';
          };
        </script>
      </head>
      <body>
      </body>
    </html>
  `);
});

// Route for retrieving uploaded images
app.get('/images', (req, res) => {
  // Read the image files in the 'public/images' folder
  const imagesDirectory = path.join(__dirname, 'public', 'images');

  fs.readdir(imagesDirectory, (err, files) => {
    if (err) {
      console.error('Error reading image directory:', err);
      res.sendStatus(500);
      return;
    }

    const imageInfo = files.map(file => ({
      name: file,
      url: `/images/${file}`,
    }));

    res.json(imageInfo);
  });
});

// Route for uploading videos
app.post('/uploadVideo', videoUpload.single('video'), (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Video Upload</title>
        <script>
          window.onload = function() {
            alert('Video Uploaded Successfully');
            window.location.href = 'VideoUpload.html';
          };
        </script>
      </head>
      <body>
      </body>
    </html>
  `);
});

// Route for retrieving uploaded videos
app.get('/videos', (req, res) => {
  // Read the video files in the 'public/videos' folder
  const videosDirectory = path.join(__dirname, 'public', 'videos');

  fs.readdir(videosDirectory, (err, files) => {
    if (err) {
      console.error('Error reading video directory:', err);
      res.sendStatus(500);
      return;
    }

    const videoInfo = files.map(file => ({
      name: file,
      url: `/videos/${file}`,
    }));

    res.json(videoInfo);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});