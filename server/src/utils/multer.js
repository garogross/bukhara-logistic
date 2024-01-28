import multer from "multer";
import {AppError} from "./appError.js";

export const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/files');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname
        const type = fileName.slice(fileName.lastIndexOf("."))
        // Specify the file name
        const uniqId = Math.round(Math.random()*1000)
        cb(null, `${Date.now()}-${uniqId}${type}`);
    },
    // limits: {
    //     fileSize: 1000000,
    // },
    fields: [{name: 'files', maxCount: 20}]
});

export const uploadFile = multer({
    storage: multerStorage,
})