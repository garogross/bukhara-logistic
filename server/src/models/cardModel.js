import mongoose from "mongoose";
import {Payment} from "./paymentModel.js";

import {setRequiredProp} from "../utils/setRequiredProp.js";
import {deleteFiles} from "../utils/files.js";

const cardSchema = new mongoose.Schema({
    number: {
        type: String,
        unique: [true, "Этот номер уже используется"],
        ...setRequiredProp('Number'),
        validate: {
            validator: function(v) {
                return v.startsWith("cash") || v.length === 16;
            },
            message: props => `Номер карты должен состоять из 16 цифр!`
        }
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        ...setRequiredProp('Owner')
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})


cardSchema.post('findOneAndDelete', async function () {
    try {
        const paymentCondition = {card: this._conditions._id }
        const payments = await Payment.find(paymentCondition)

        if(payments.length) {
            const files = payments.flatMap(item => item.files)
            deleteFiles(files)
            await Payment.deleteMany(paymentCondition);
        }
    } catch (error) {
        console.error(error);
    }
});

export const Card = mongoose.model('Card',cardSchema)
