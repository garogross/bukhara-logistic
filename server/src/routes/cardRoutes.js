import express from "express";
import {protect, restrictTo} from "../controllers/authController.js";
import {createCard, deleteCard, getAllCard, updateCard, validateCard} from "../controllers/cardController.js";

import {userRoles} from "../constants.js";

export const cardRouter = express.Router()

cardRouter.use(protect)
cardRouter.get('/', getAllCard)
// private routes

cardRouter.use(restrictTo(userRoles.admin, userRoles.superAdmin))
// admin restricted routes
cardRouter.post('/create', validateCard, createCard)
cardRouter
    .route("/:id")
    .delete(deleteCard)
    .patch(updateCard)
