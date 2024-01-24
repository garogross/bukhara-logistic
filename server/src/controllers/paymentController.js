import {HandlerFactory} from "./HandlerFactory.js";
import {Card} from "../models/cardModel.js";
import {Payment} from "../models/paymentModel.js";

import {AppError} from "../utils/appError.js";
import {uploadFile} from "../utils/multer.js";
import {catchAsync} from "../utils/catchAsync.js";
import {userRoles} from "../constants.js";


const handleFactory = new HandlerFactory(Payment, 'payment')

export const uploadPaymentFiles = uploadFile.array("files[]")
export const savePaymentFiles = catchAsync(async (req,res,next) => {
    req.body.files = req.files.map(item => `/files/${item.filename}`)
    next()
})


export const createPayment = handleFactory.create()
export const getAllPayment = catchAsync(async (req,res,next) => {
    if(req.user.role !== userRoles.admin) {
        const userCards = await Card.find({owner: req.user._id})
        if(!userCards.find(item => item.id === req.params.cardId)) {
            return next(new AppError("You Can get only your cards."))
        }

    }
    const data = await Payment.find({card: req.params.cardId})
    res.send({
        status: "success",
        data
    })
})

export const downloadFile = catchAsync(async (req,res) => {
    if(!req.params.fileName) return new AppError("filename is required")
    res.download("public/files/"+req.params.fileName,req.params.fileName)
})
export const updatePayment = handleFactory.updateOne()
