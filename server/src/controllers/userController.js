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
    const {fullName, username, password, role,profession} = req.body

    const user = await User.create({fullName, username, password, role,profession})
    const token = signToken(user._id)
    const {
        password: pass,
        __v,
        ...userData
    } = {...user.toObject()};
    res.send({
        status: 'success',
        token,
        data: userData,
    })
})

export const login = catchAsync(async (req, res, next) => {
    const {username, password} = req.body

    if (!username || !password) {
        return next(new AppError('Пожалуйста, укажите имя пользователя или пароль', 400, {username: {}}))
    }

    const user = await User.findOne({
    username: {
        $regex: new RegExp(`^${username}$`, 'i')
    }
    }).select('+password')

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

    const statment = req.user.role === userRoles.admin ?
        {role: userRoles.employee} :
        {
            role: {$ne: userRoles.superAdmin},
        }

    const users = await User.find(statment).select(["fullName", "role","profession"])

    const cards = await getCards()

    res.send({
        status: 'success',
        data: {users, cards}
    })
})

export const updateUserData = handlerFactory.updateOne()

export const deleteUser = handlerFactory.deleteOne()

export const changePassword = catchAsync(async (req,res,next) => {
    const {currentPassword,newPassword} = req.body

    if (!currentPassword) {
        return next(new AppError('current password fields are required', 400,{currentPassword: "1"}))
    }
    if (!newPassword) {
        return next(new AppError('new password fields are required', 400,{newPassword: "1"}))
    }

    const user = await User.findById(req.user.id).select("+password")
    const correctPassword = await user.comparePassword(currentPassword,user.password)

    if(!correctPassword) {
        return next(new AppError("currentPassword is wrong.",400,{currentPassword: "1"}))
    }

    if(!user) {
        return next(new AppError("You're not logged in.",401))
    }

    user.password = newPassword
    await user.save()
    createAndSendToken(user, res)
})