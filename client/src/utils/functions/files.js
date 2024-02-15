import {isProduction} from "../../constants";
import {baseUrl, downloadFileUrl, proxy} from "../../redux/action/fetchTools";
import EXIF from "exif-js";

export const imagePath = (item) =>  `${isProduction ? proxy : ""}/api${item}`

export const getFileName = (file) => file.replace("/files/", "")

export const downloadFilePath = (file) => `${proxy}${baseUrl}${downloadFileUrl}${getFileName(file)}`


export const onUploadFile = (event, clb) => {
    const selectedFiles = event.target.files;
    // Iterate through each selected file
    Array.from(selectedFiles).forEach((file) => {
        if (file.type.startsWith('image')) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    EXIF.getData(file, function () {
                        const orientation = EXIF.getTag(this, 'Orientation');
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        if ([5, 6, 7, 8].indexOf(orientation) > -1) {
                            canvas.width = img.width;
                            canvas.height = img.height;
                        } else {
                            canvas.width = img.width;
                            canvas.height = img.height;
                        }


                        ctx.drawImage(img, 0, 0);

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
