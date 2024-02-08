import sharp from "sharp";

export const resizeImage = async (file,toFile,sizes = 500) => {
    await sharp(file.path)
        .resize(sizes)
        .toFile(toFile);
}

