const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);

// CORS setup to allow frontend to access the backend
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Access-Control-Allow-Origin'],
    credentials: true
}));

// Multer setup to handle file uploads
const upload = multer({ dest: 'src/backend/modded/' }); // Temporary storage folder

// Route to handle file upload and conversion
app.post('/input_tif', upload.single('image'), (req, res) => {
    const filePath = req.file.path; // Temporary file path from multer
    const fileName = req.file.originalname.split('.')[0]; // Get the original file name (without extension)

    // Convert the .tif file to .jpg
    const convertedFilePath = path.join('src/backend/modded', `${fileName}.jpg`);

    sharp(filePath)
        .toFormat('jpg')
        .toFile(convertedFilePath, (err, info) => {
            if (err) {
                console.log('Error during conversion:', err);
                return res.status(500).send('Error converting the image');
            }

            // Send the converted .jpg image as response
            res.sendFile(path.resolve(convertedFilePath), (err) => {
                if (err) {
                    console.log('Error sending file:', err);
                    return res.status(500).send('Error sending the file');
                }

                // Clean up: delete the original file and the converted file after sending
                // fs.unlink(filePath, () => {}); // Delete original uploaded file
                // fs.unlink(convertedFilePath, () => {}); // Delete converted file
            });
        });
});

// Start the server
server.listen(3001, '127.0.0.1', (err) => {
    if (err) {
        console.log('Server startup error:', err);
    } else {
        console.log("Server running on http://127.0.0.1:3001");
    }
});
