import express from "express";
import {protect, restrictTo} from "../controllers/authController.js";
import {
    createCard,
    deleteCard,
    getAllCard,
    validateCard
} from "../controllers/cardController.js";

import {userRoles} from "../constants.js";

export const cardRouter = express.Router()

cardRouter.use(protect)
cardRouter.get('/', getAllCard)
// private routes

cardRouter.use(restrictTo(userRoles.admin))
// admin restricted routes
cardRouter.post('/create',validateCard, createCard)
cardRouter.delete("/:id",deleteCard)