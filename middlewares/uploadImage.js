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


export {uploadPhoto};
