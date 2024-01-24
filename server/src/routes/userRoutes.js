import express from "express";

import {
    deleteUser,
    getAllUsers,
    login,
    signUp,
    updateUserData
} from "../controllers/userController.js";
import {protect, restrictTo} from "../controllers/authController.js";
import {userRoles} from "../constants.js";

export const userRoutes = express.Router()

userRoutes.post('/login', login)

userRoutes.post('/signup', signUp)

userRoutes.use(protect)

userRoutes.use(restrictTo(userRoles.admin))
userRoutes.get('/', getAllUsers)
userRoutes.patch('/:id', updateUserData)
userRoutes.delete('/:id', deleteUser)