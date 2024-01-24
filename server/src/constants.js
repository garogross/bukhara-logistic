import {fileURLToPath} from 'url'
import {dirname} from "path"

const __filename = fileURLToPath(import.meta.url);
export const DIRNAME = dirname(__filename);

export const userRoles = {
    employee: "employee",
    admin: "admin",
}

export const paymentStatuses = {
    notSubmitted: "Ne сдано",
    submitted: "Сдано",
    accepted: "Принято",
}
