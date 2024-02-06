import {HandlerFactory} from "./HandlerFactory.js";
import {Card} from "../models/cardModel.js";
import {Payment} from "../models/paymentModel.js";

import {AppError} from "../utils/appError.js";
import {uploadFile} from "../utils/multer.js";
import {catchAsync} from "../utils/catchAsync.js";
import {paymentStatuses, userRoles} from "../constants.js";
import {ApiFeatures} from "../utils/apiFeatures.js";
import {getCards} from "./cardController.js";


export const downloadFile = catchAsync(async (req, res) => {
    if (!req.params.fileName) return new AppError("filename is required")
    res.download("public/files/" + req.params.fileName, req.params.fileName)
})


const handleFactory = new HandlerFactory(Payment, 'payment')

const getFilteredPayments = async (cardId, regQuery,getCard) => {
    const filterParams = {card: cardId}
    const query = Payment.find(filterParams).populate({
        path: "acceptedBy",
        select: "fullName"
    })
    regQuery.sort = '-date'

    const features = new ApiFeatures(query, {
        ...regQuery,
        card: cardId
    })
    const filteredFeatures = features.paginate().filter().sort()
    const filterObj = features.filter(true)
    const totalCount = await Payment.countDocuments(filterObj);
    const data = await filteredFeatures.query

    const result = {totalCount, data}
    if (getCard) {
        const card = await getCards(cardId,true)
        result.card = card ? card[0] : null
    }

    return result
}

export const uploadPaymentFiles = uploadFile.array("files[]")
export const savePaymentFiles = catchAsync(async (req, res, next) => {
    req.body.files = req.files.map((item, index) => `/files/${item.filename}`)
    next()
})


export const createPayment = catchAsync(async (req,res,next) => {
    await Payment.create(req.body)
    req.params.cardId = req.body.card
    req.params.getCard = true
    next()
})
export const getAllPayment = catchAsync(async (req, res, next) => {
    if (req.user.role === userRoles.employee) {
        const userCards = await Card.find({owner: req.user._id})
        if (!userCards.find(item => item.id === req.params.cardId.toString())) {
            return next(new AppError("You Can get only your cards."))
        }
    }
    const getCard = req.params.getCard
    const {totalCount, data,card} = await getFilteredPayments(req.params.cardId, req.query,getCard)
    res.send({
        card: card || null,
        status: "success",
        totalCount,
        data,
        length: data.length
    })
})


export const updatePayment = handleFactory.updateOne()

export const deletePayments = catchAsync(async (req, res, next) => {
    const {from, to} = req.body
    const {cardId} = req.params

    if (!from) return next(new AppError("from is required props", 400, {from: "1"}))
    if (!to) return next(new AppError("to is required props", 400, {to: "1"}))
    await Payment.deleteMany({
        card: cardId,
        date: {$gte: new Date(from), $lte: new Date(to)}
    })
    req.params.getCard = true
    next()
})

export const deleteOnePayment = catchAsync(async (req, res, next) => {
    const _id = req.params.id
    const curPayment = await Payment.findById(_id)

    if (!curPayment) {
        return next(new AppError("Invalid Id"))
    }
    if (req.user.role === userRoles.employee && curPayment.status === paymentStatuses.accepted) {
        return next(new AppError("This payment is already accepted."))
    }
    await Payment.deleteOne({_id})
    req.params.cardId = curPayment.card
    req.params.getCard = true
    next()
})