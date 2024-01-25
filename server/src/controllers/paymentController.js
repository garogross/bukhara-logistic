import {HandlerFactory} from "./HandlerFactory.js";
import {Card} from "../models/cardModel.js";
import {Payment} from "../models/paymentModel.js";

import {AppError} from "../utils/appError.js";
import {uploadFile} from "../utils/multer.js";
import {catchAsync} from "../utils/catchAsync.js";
import {userRoles} from "../constants.js";
import {ApiFeatures} from "../utils/apiFeatures.js";


const handleFactory = new HandlerFactory(Payment, 'payment')

const getFilteredPayments = async (cardId,regQuery) => {
    const filterParams = {card: cardId}
    const query = Payment.find(filterParams).populate({
        path: "acceptedBy",
        select: "fullName"
    })

    const features = new ApiFeatures(query, {
        ...regQuery,
        card: cardId
    })
    const filteredFeatures = features.paginate().filter()
    const filterObj = features.filter(true)
    const totalCount = await Payment.countDocuments(filterObj);
    const data = await filteredFeatures.query

    return {totalCount,data}
}

export const uploadPaymentFiles = uploadFile.array("files[]")
export const savePaymentFiles = catchAsync(async (req,res,next) => {
    req.body.files = req.files.map(item => `/files/${item.filename}`)
    next()
})


export const createPayment = handleFactory.create()
export const getAllPayment = catchAsync(async (req,res,next) => {
    if(req.user.role === userRoles.employee) {
        const userCards = await Card.find({owner: req.user._id})
        if(!userCards.find(item => item.id === req.params.cardId)) {
            return next(new AppError("You Can get only your cards."))
        }
    }
    const {totalCount,data} = await getFilteredPayments(req.params.cardId,req.query)
    res.send({
        status: "success",
        totalCount,
        data,
        length: data.length
    })
})

export const downloadFile = catchAsync(async (req,res) => {
    if(!req.params.fileName) return new AppError("filename is required")
    res.download("public/files/"+req.params.fileName,req.params.fileName)
})
export const updatePayment = handleFactory.updateOne()

export const deletePayments = catchAsync(async (req,res,next) => {
    const {from,to} = req.body
    const {cardId} = req.params

    if(!from) return next(new AppError("from is required props",400,{from: "1"}))
    if(!to) return next(new AppError("to is required props",400,{to: "1"}))
     await Payment.deleteMany({
        card: cardId,
        date: {$gte: new Date(from),$lte: new Date(to)}
    })

    const {data,totalCount} = await getFilteredPayments(cardId,req.query)
    res.send({
        status: "success",
        data,
        totalCount
    })

})