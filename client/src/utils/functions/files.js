import {isProduction} from "../../constants";
import {baseUrl, downloadFileUrl, proxy} from "../../redux/action/fetchTools";

export const imagePath = (item) =>  `${isProduction ? proxy : ""}/api${item}`

export const getFileName = (file) => file.replace("/files/", "")

export const downloadFilePath = (file) => `${proxy}${baseUrl}${downloadFileUrl}${getFileName(file)}`