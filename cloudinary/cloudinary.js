const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'YELPCAMP',
        formats: ['png' , 'jpeg', 'jpg'], // supports promises as well
        // public_id: (req, file) => file.originalname,
        // unique_filename: 'TRUE'
    }
});

module.exports = { storage, cloudinary }; 