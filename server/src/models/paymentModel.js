import mongoose from "mongoose";

import {setRequiredProp} from "../utils/setRequiredProp.js";

import {DIRNAME, paymentStatuses} from "../constants.js";
import * as fs from "fs";
import * as path from "path";

const paymentSchema = new mongoose.Schema({
    files: {
        type: [String],
        ...setRequiredProp('Files'),
        validate: {
            validator: function(v) {
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
    comments: String
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})


export const Payment = mongoose.model('Payment',paymentSchema)
