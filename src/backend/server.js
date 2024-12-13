// Code snippet is using the ConvertAPI Node.js Client: https://github.com/ConvertAPI/convertapi-nodejs

var convertapi = require('convertapi')('secret_wbnvbnq24jGH9fRR');
convertapi.convert('jpg', {
    File: 'src/backend/test_image.tif'
}, 'tiff')
.then(function(result) {
    result.saveFiles('src/backend/file_image.jpg');
    console.log(result.file.url);
});