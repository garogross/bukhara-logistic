import mongoose from "mongoose";

import {HandlerFactory} from "./HandlerFactory.js";
import {Card} from "../models/cardModel.js";

import {AppError} from "../utils/appError.js";
import {catchAsync} from "../utils/catchAsync.js";
import {userRoles} from "../constants.js";


const handleFactory = new HandlerFactory(Card, 'card')

export const getCards = async (year,id,getOne) => {
    const curYear = year || new Date().getFullYear()
    const startOfYear = new Date(curYear, 0, 1);
    const endOfYear = new Date(curYear, 11, 31);
    const endOfMonth = new Date();
    const startOfMonth = new Date(endOfMonth);
    startOfMonth.setMonth(startOfMonth.getMonth() - 1)

    const matchProp = getOne ? '_id' : "owner"
    let match = {}
    if(id) match[matchProp] = new mongoose.Types.ObjectId(id)

    if(id && !getOne) match = {
        ...match,
        $or: [
            { isHidden: { $exists: false } },
            { isHidden: false }
        ]
    }

    const cards = await Card.aggregate([
        {
            $match: match
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
                isHidden: { $ifNull: ['$isHidden', false] },
                payments: 1, // Keep all payments for further processing
            }
        },
        {
            $project: {
                _id: 1,
                number: 1,
                owner: 1,
                isHidden: 1,
                monthlyPayments: {
                    $filter: {
                        input: '$payments',
                        as: 'payment',
                        cond: {
                            $and: [
                                { $gte: ['$$payment.date', startOfMonth] },
                                { $lt: ['$$payment.date', endOfMonth] }
                            ]
                        }
                    }
                },
                yearlyPayments: {
                    $filter: {
                        input: '$payments',
                        as: 'payment',
                        cond: {
                            $and: [
                                { $gte: ['$$payment.date', startOfYear] },
                                { $lt: ['$$payment.date', endOfYear] }
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
                isHidden: 1,
                totalMonthlyPayments: {
                    $sum: '$monthlyPayments.amount'
                },
                totalYearlyPayments: {
                    $sum: '$yearlyPayments.amount'
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
    const cards = await getCards(req.query.year,id,false)

    res.send({
        status: "success",
        data: cards,
        length: cards.length
    })
})
export const deleteCard = handleFactory.deleteOne()
export const updateCard = handleFactory.updateOne()
