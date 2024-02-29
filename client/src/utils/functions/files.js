import {isProduction} from "../../constants";
import {baseUrl, downloadFileUrl, proxy} from "../../redux/action/fetchTools";
import EXIF from "exif-js";

export const imagePath = (item) =>  `${isProduction ? proxy : ""}/api${item}`

export const getFileName = (file) => file.replace("/files/", "")

export const downloadFilePath = (file) => `${proxy}${baseUrl}${downloadFileUrl}${getFileName(file)}`


export const onUploadFile = (event,clb) => {
    const selectedFiles = event.target.files;
    // Iterate through each selected file
    Array.from(selectedFiles).forEach((file) => {
        if (file.type.startsWith('image')) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Use exif-js to read EXIF data
                    EXIF.getData(file, function () {
                        const orientation = EXIF.getTag(this, 'Orientation');
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        if ([5, 6, 7, 8].indexOf(orientation) > -1) {
                            canvas.width = img.height;
                            canvas.height = img.width;
                        } else {
                            canvas.width = img.width;
                            canvas.height = img.height;
                        }

                        // Apply rotation based on EXIF orientation
                        switch (orientation) {
                            case 2:
                                ctx.transform(-1, 0, 0, 1, img.width, 0);
                                break;
                            case 3:
                                ctx.transform(-1, 0, 0, -1, img.width, img.height);
                                break;
                            case 4:
                                ctx.transform(1, 0, 0, -1, 0, img.height);
                                break;
                            case 5:
                                ctx.transform(0, 1, 1, 0, 0, 0);
                                break;
                            case 6:
                                ctx.transform(0, 1, -1, 0, img.height, 0);
                                break;
                            case 7:
                                ctx.transform(0, -1, -1, 0, img.height, img.width);
                                break;
                            case 8:
                                ctx.transform(0, -1, 1, 0, 0, img.width);
                                break;
                            default:
                                break;
                        }

                        // Draw the image on the canvas
                        ctx.drawImage(img, 0, 0);
                        // Convert canvas back to a Blob
                        canvas.toBlob((blob) => {
                            const rotatedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                            });

                            // Set the rotated image file and URL
                            clb(rotatedFile)
                        }, 'image/jpeg');
                    });
                };
                img.src = e.target.result;
            };

            reader.readAsDataURL(file);
        } else {
            clb(file)
        }

    });


};
