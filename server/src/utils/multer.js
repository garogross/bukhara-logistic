import multer from "multer";
import {AppError} from "./appError.js";

export const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/files');
    },
    filename: (req, file, cb) => {
        // Specify the file name
        cb(null, Date.now() + '-' + file.originalname);
    },
    limits: {
        fileSize: 1000000,
    },
    fields: [{name:'files',maxCount:20}]
});

export const uploadFile = multer({
    storage: multerStorage,
})