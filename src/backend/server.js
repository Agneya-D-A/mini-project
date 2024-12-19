const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const axios = require('axios');
const canvas = require('canvas')

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
                fs.unlink(filePath, () => {}); // Delete original uploaded file
                // fs.unlink(convertedFilePath, () => {}); // Delete converted file
            });
        });
});


const overlayMask = async (imagePath, maskPath) => {
    const img = new canvas.Image();
    const mask = new canvas.Image();

    img.src = fs.readFileSync(imagePath);
    mask.src = fs.readFileSync(maskPath);

    const c = canvas.createCanvas(img.width, img.height);
    const ctx = c.getContext('2d');

    // Draw the original image and overlay the mask
    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.drawImage(mask, 0, 0, img.width, img.height); // Mask overlay

    const overlayedImagePath = 'overlayed_image.png';
    
    const out = fs.createWriteStream(overlayedImagePath);
    const stream = c.createPNGStream();
    stream.pipe(out);
    
    return new Promise((resolve, reject) => {
        out.on('finish', () => resolve(overlayedImagePath));  // Resolve with the path after saving
        out.on('error', reject);
    });
};

// Function to convert overlayed image to JPG
const convertToJPG = async (overlayedImagePath) => {
    const jpgImagePath = overlayedImagePath.replace('.png', '.jpg');
    try {
        await sharp(overlayedImagePath)
            .toFormat('jpg')
            .toFile(jpgImagePath);
        fs.unlinkSync(overlayedImagePath);  // Remove PNG after conversion
        return jpgImagePath;  // Return the JPG path
    } catch (err) {
        console.error('Error converting to JPG:', err);
        throw err;
    }
};

app.post('/fetch-mask', upload.single('image'), async (req,res)=>{
    try{
        const filePath = req.file.path; // Temporary file path from multer
        const fileName = req.file.originalname.split('.')[0]; // Get the original file name (without extension)

        const convertedFilePath = path.join('src/backend/modded', `${fileName}.jpg`);

        await sharp(filePath)
        .toFormat('tif')
        .toFile(convertedFilePath);

        const flaskResponse = await axios.post('http://127.0.0.1:5000/predict',{ imagePath: convertedFilePath });
        const {maskPath} = flaskResponse.data;

        const overlayedImagePath = await overlayMask(filePath, maskPath);

        // Convert the final image to JPG and send it back to React
        const jpgImagePath = await convertToJPG(overlayedImagePath);

        // Send the final image file to the frontend
        res.sendFile(path.resolve(jpgImagePath), (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending the file');
            }
        });

    }
    catch(err){
        console.error('Error converting to JPG:', err);
        throw err;
    }
})

// Start the server
server.listen(3001, '127.0.0.1', (err) => {
    if (err) {
        console.log('Server startup error:', err);
    } else {
        console.log("Server running on http://127.0.0.1:3001");
    }
});
