import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs'

const absolutePath = path.resolve(process.cwd(), 'public');

// Define storage and file filter
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, absolutePath)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.jpeg');
    }
});

const uploadPhoto = multer({
    storage: multerStorage
})

// Middleware to resize uploaded image
const resizeProfilePicture = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const { path } = req.file;
    req.theOriginalPath = path
    const resizedImagePath = path.replace('.jpeg', '-resized.jpeg');

    sharp(path)
        .resize({ width: 200, height: 200, fit: 'fill' })
        .toFormat('jpeg') 
        .jpeg({ quality: 80 })
        .toFile(resizedImagePath, (err, info) => {
            if (err) {
                next(err);
            }
            req.file.path = resizedImagePath;
            next();
        });
};


export {uploadPhoto,resizeProfilePicture};
