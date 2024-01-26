import mongoose from "mongoose";

import {HandlerFactory} from "./HandlerFactory.js";
import {Card} from "../models/cardModel.js";

import {AppError} from "../utils/appError.js";
import {catchAsync} from "../utils/catchAsync.js";
import {userRoles} from "../constants.js";


const handleFactory = new HandlerFactory(Card, 'card')

export const getCards = async (id) => {
    const cards = await Card.aggregate([
        {
            $match: id ? {
                owner: new mongoose.Types.ObjectId(id)
            } : {}
        },
        {
            $lookup: {
                from: 'payments', // Assuming your Payment model is named 'Payment'
                localField: '_id',
                foreignField: 'card',
                as: 'payments'
            }
        },
        {
            $project: {
                _id: 1,
                number: 1,
                owner: 1,
                payments: {
                    $filter: {
                        input: '$payments',
                        as: 'payment',
                        cond: {
                            $and: [
                                { $gte: ['$$payment.date', new Date(new Date().getFullYear(), new Date().getMonth(), 1)] },
                                { $lt: ['$$payment.date', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)] }
                            ]
                        }
                    }
                },
            }
        },
        {
            $project: {
                _id: 1,
                number: 1,
                owner: 1,
                totalPayments: {
                    $sum: '$payments.amount'
                }
            }
        }
    ])

    return cards;
}

export const validateCard = catchAsync(async (req,res,next) => {
    const {number,owner} = req.body
    if(!number || (!number.toString().startsWith("cash") && (!+number || number.length !== 4))) return next(new AppError("Не верный номер карты",400,{number: "invalid"}))

    if(number.toString().startsWith("cash")) {
        const curCash = await Card.findOne({
            owner,
            number: new RegExp("cash", 'i')
        })
        if(curCash) return next(new AppError("Для этого пользователя уже есть наличку",400,{number: "invalid"}))
    }
    next()
})

export const createCard = handleFactory.create()
export const getAllCard = catchAsync(async (req,res) => {
    const id = req.user.role === userRoles.employee ? req.user.id : null
    const cards = await getCards(id)

    res.send({
        status: "success",
        data: cards,
        length: cards.length
    })
})
export const deleteCard = handleFactory.deleteOne()
