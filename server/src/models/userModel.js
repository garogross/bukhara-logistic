import mongoose from "mongoose";
import bcrypt from "bcryptjs"

import {setRequiredProp} from "../utils/setRequiredProp.js";
import {userRoles} from "../constants.js"
import {Payment} from "./paymentModel.js";
import {deleteFiles} from "../utils/files.js";
import {Card} from "./cardModel.js";

export const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        ...setRequiredProp('full name')
    },
    username: {
        type: String,
        unique: [true, "this username is already used"],
        required: [true, "username is required"],
        ...setRequiredProp('full name')
    },
    role: {
        type: String,
        enum: Object.values(userRoles),
        default: userRoles.employee
    },
    password: {
        type: String,
        minlength: 5,
        select: false,
    },

})

// hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.post('findOneAndDelete', async function () {
    try {
        const cardCondition = {owner: this._conditions._id }
        const cards = await Card.find(cardCondition)

        if(cards.length) {
            const cardIds = cards.map(item => item.id)
            const paymentCondition = {card: {$in: cardIds}}
            const payments = await Payment.find(paymentCondition)
            const files = payments.flatMap(item => item.files)
            deleteFiles(files)
            await Payment.deleteMany(paymentCondition);
            await Card.deleteMany(cardCondition);
        }
    } catch (error) {
        console.error(error);
    }
});

userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword)
}

export const User = mongoose.model('User', userSchema)