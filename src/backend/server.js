const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const http = require('http');
const path = require('path');
const convertapi = require('convertapi')('secret_wbnvbnq24jGH9fRR');

const app = express();
const server = http.createServer(app);

// Middleware: CORS setup
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Access-Control-Allow-Origin'],
    credentials: true
}));

// Multer setup for file uploads
const upload = multer({ dest: 'src/backend/modded/' }); // Temporary folder for uploads

// Function to convert TIFF to JPG using ConvertAPI
const convertImage = async (filePath) => {
    try {
        console.log("Converting file...");
        const result = await convertapi.convert('jpg', { File: filePath }, 'tiff');

        // Save the converted file with a random .jpg name
        const jpgName = `${Date.now()}.jpg`; // Generate unique file name
        const savedPath = `src/backend/modded/${jpgName}`;

        await result.saveFiles(savedPath);
        console.log('File converted and saved:', savedPath);
        return savedPath;
    } catch (err) {
        console.error('Conversion error:', err);
        return null; // Return null on error
    }
};

// Route: Handles TIFF file uploads and conversion
app.post('/input_tif', upload.single('image'), async (req, res) => {
    const filePath = req.file.path; // Temporary file path
    console.log('Uploaded file:', filePath);

    // Convert the file
    const convertedPath = await convertImage(filePath);
    if (!convertedPath) {
        return res.status(500).send('Error converting the file');
    }

    // Send the converted file back to the client
    res.sendFile(path.resolve(convertedPath), (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending the file');
        } else {
            // Delete the temporary original file and converted file after sending
            fs.unlink(filePath, () => console.log('Deleted original file:', filePath));
            fs.unlink(convertedPath, () => console.log('Deleted converted file:', convertedPath));
        }
    });
});

// Start the server
server.listen(3001, '127.0.0.1', (err) => {
    if (err) {
        console.error('Server startup error:', err);
    } else {
        console.log("Server running on http://127.0.0.1:3001");
    }
});
