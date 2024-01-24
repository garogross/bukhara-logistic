import jwt from "jsonwebtoken"

import {User} from "../models/userModel.js";
import {Card} from "../models/cardModel.js";
import {HandlerFactory} from "./HandlerFactory.js";

import {AppError} from "../utils/appError.js";
import {catchAsync} from "../utils/catchAsync.js";
import {getCards} from "./cardController.js";

import {userRoles} from "../constants.js";


const handlerFactory = new HandlerFactory(User, 'user')

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

const createAndSendToken = (user, res, statusCode = 200) => {
    const token = signToken(user._id)

    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        user,
        token
    })
}

export const signUp = catchAsync(async (req, res, next) => {
    const {fullName, username, password, role} = req.body

    const user = await User.create({fullName, username, password, role})
    const token = signToken(user._id)
    const {
        password: pass,
        __v,
        ...userData
    } = {...user.toObject()};

    let cash = null
    if(userData.role === userRoles.employee) {
        cash = await Card.create({number: `cash-${user._id}`,owner: user._id})
    }

    res.send({
        status: 'success',
        token,
        data: userData,
        cash
    })
})

export const login = catchAsync(async (req, res, next) => {
    const {username, password} = req.body

    if (!username || !password) {
        return next(new AppError('Пожалуйста, укажите имя пользователя или пароль', 400, {username: {}}))
    }

    const user = await User.findOne({username}).select('+password')

    if (!user) {
        return next(new AppError('Неверный username', 401, {username: {}}))
    }
    const isPasswordCorrect = await user.correctPassword(password, user.password)

    if (!isPasswordCorrect) {
        return next(new AppError('Неверный пароль', 401, {password: {}}))
    }

    createAndSendToken(user, res)

})


export const getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find({
        role: userRoles.employee,
    }).select("fullName")

    const cards = await getCards()

    res.send({
        status: 'success',
        data: {users,cards}
    })
})

export const updateUserData = handlerFactory.updateOne()

export const deleteUser = handlerFactory.deleteOne()
