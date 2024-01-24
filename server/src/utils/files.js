import * as path from "path";
import {DIRNAME} from "../constants.js";
import * as fs from "fs";

export const deleteFiles = (files) => {
    files.forEach(item => {
        const filePath = path.join(DIRNAME.replace('/src',""), `public/${item}`);

        // Use fs.unlink to delete the file
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file ${item}:`, err);
            }
        });
    })
}