import mongoose from "mongoose";

import {setRequiredProp} from "../utils/setRequiredProp.js";

import {paymentStatuses} from "../constants.js";
import bcrypt from "bcryptjs";
import {AppError} from "../utils/appError.js";

const paymentSchema = new mongoose.Schema({
    files: {
        type: [String],
        ...setRequiredProp('Files'),
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: props => `You need to upload file`
        }
    },
    subject: {
        type: String,
        ...setRequiredProp('Subject')
    },
    purpose: {
        type: String,
        ...setRequiredProp('Purpose')
    },
    date: {
        type: Date,
        ...setRequiredProp('Date')
    },
    amount: {
        type: Number,
        ...setRequiredProp('Amount')
    },
    checkNum: {
        type: String,
        ...setRequiredProp('Check number')
    },
    status: {
        type: String,
        enum: Object.values(paymentStatuses),
        default: paymentStatuses.notSubmitted
    },
    card: {
        type: mongoose.Schema.ObjectId,
        ref: "Card",
        ...setRequiredProp('Card')
    },
    acceptedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: null
    },
    acceptedAt: {
        type: Date,
        default: null
    },
    submittedAt: {
        type: Date,
        default: null
    },
    comments: String
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})


paymentSchema.pre('findOneAndUpdate',  async function (next) {
    const status = this._update.status
    if (!status) return next()
    if (status === paymentStatuses.submitted) this._update.submittedAt = new Date()
    if (status === paymentStatuses.accepted) {
        if (!this._update.acceptedBy) return next(new AppError("acceptedBy is required prop."))
        this._update.acceptedAt = new Date()
    }
    next()
})

export const Payment = mongoose.model('Payment', paymentSchema)
