import express from "express";

import {
    changePassword,
    deleteUser,
    getAllUsers,
    login,
    signUp,
    updateUserData
} from "../controllers/userController.js";
import {protect, restrictTo} from "../controllers/authController.js";
import {signupRestrictToParams, userRoles} from "../constants.js";

export const userRoutes = express.Router()

userRoutes.post('/login', login)

const restricts = signupRestrictToParams()
userRoutes.post('/signup',
    // protect,
    // restrictTo(...restricts),
    signUp
)

userRoutes.use(protect)

userRoutes.patch("/updatePassword",changePassword)

userRoutes.use(restrictTo(userRoles.admin,userRoles.superAdmin))
userRoutes.get('/', getAllUsers)
userRoutes.patch('/:id', updateUserData)
userRoutes.delete('/:id', deleteUser)