import express from "express";
import {protect, restrictTo} from "../controllers/authController.js";
import {
    createPayment, deleteOnePayment, deletePayments, downloadFile,
    getAllPayment, savePaymentFiles,
    updatePayment, updatePaymentFiles, uploadPaymentFiles
} from "../controllers/paymentController.js";

import {userRoles} from "../constants.js";

export const paymentRouter = express.Router()

paymentRouter.get("/download/:fileName", downloadFile)

paymentRouter.use(protect)
// private routes

paymentRouter.patch(
    '/updateStatus/:id',
    updatePayment
)

paymentRouter.patch(
    '/:id',
    uploadPaymentFiles,
    savePaymentFiles,
    updatePaymentFiles,
    updatePayment
)
paymentRouter.get('/:cardId', getAllPayment)

paymentRouter.post(
    '/create',
    uploadPaymentFiles,
    savePaymentFiles,
    createPayment,
)

paymentRouter.delete(
    "/delete/:id",
    deleteOnePayment,
    getAllPayment
)

paymentRouter.delete("/:cardId",deletePayments,getAllPayment)

paymentRouter.use(restrictTo(userRoles.admin, userRoles.superAdmin))
