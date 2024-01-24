import * as fs from "fs";
import * as path from "path";
import {DIRNAME} from "../../constants.js";
import {
    appContents, appText,
    controllerContent, crudControllerContent, crudRouterContents,
    crudText,
    fileCamel,
    fileLower,
    modelContent,
    routerContent
} from "./contents.js";

const {argv} = process

const fileName = argv[2]
const camelFileName = fileName[0].toUpperCase() + fileName.slice(1)
const replaceNames = (content,crudContents) => {
    let result = content
    if(crudContents) {
        crudContents.forEach(item => {
            const replaceText = argv.includes('crud') ? item  :""
            result = result.replace(crudText,replaceText)
        })
    }
    result = result.replaceAll(fileLower,fileName).replaceAll(fileCamel,camelFileName)
    return result
}


// controller
fs.writeFile(path.join(DIRNAME,`controllers/${fileName}Controller.js`), replaceNames(controllerContent,crudControllerContent), (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.dir(`File ${fileName}Controller created successfully.`);
    }
});

// model
fs.writeFile(path.join(DIRNAME,`models/${fileName}Model.js`), replaceNames(modelContent), (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.dir(`File ${fileName}Model created successfully.`);
    }
});

// route
fs.writeFile(path.join(DIRNAME,`routes/${fileName}Routes.js`), replaceNames(routerContent,crudRouterContents), (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.dir(`File ${fileName}Routes created successfully.`);
    }
});


// app.js

const appFilePath = path.join(DIRNAME.slice(0,DIRNAME.length - 3),`app.js`)

fs.readFile(appFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    let modifiedContent = data

    appContents.forEach((item,index) => {
        modifiedContent = modifiedContent.replace(`${appText}${index+1}`, `${appText}${index+1}\n${item}`);
    })
    fs.writeFile(appFilePath, replaceNames(modifiedContent), 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.dir('File content has been updated.');
    });
});