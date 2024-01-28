import express from "express";
import {protect, restrictTo} from "../controllers/authController.js";
import {
    createPayment, deleteOnePayment, deletePayments, downloadFile,
    getAllPayment, savePaymentFiles,
    updatePayment, uploadPaymentFiles
} from "../controllers/paymentController.js";

import {userRoles} from "../constants.js";

export const paymentRouter = express.Router()

paymentRouter.get("/download/:fileName",downloadFile)

paymentRouter.use(protect)
// private routes

paymentRouter.get('/:cardId', getAllPayment)
paymentRouter.patch('/:id',updatePayment)

paymentRouter.post(
    '/create',
    uploadPaymentFiles,
    savePaymentFiles,
    createPayment
)

paymentRouter.delete("delete/:id",deleteOnePayment)

paymentRouter.use(restrictTo(userRoles.admin,userRoles.superAdmin))
paymentRouter.delete("/:cardId",deletePayments)
