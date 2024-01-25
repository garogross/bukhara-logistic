import express from "express"
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import {xss} from "express-xss-sanitizer";
import hpp from 'hpp'

import {AppError} from "./src/utils/appError.js";
import {globalErrorHandler} from "./src/controllers/errorController.js";

// ROUTES1
import {paymentRouter} from "./src/routes/paymentRoutes.js";
import {cardRouter} from "./src/routes/cardRoutes.js";
import {userRoutes} from "./src/routes/userRoutes.js";
import multer from "multer";
import {multerStorage} from "./src/utils/multer.js";
import bodyParser from "body-parser";
import * as path from "path";
import {DIRNAME} from "./src/constants.js";

export const app = express()

// add headers for secure

app.use(helmet())

app.use(bodyParser. text({type: '/'}));

// save as json
app.use(express.json())

// limit requests
const limiter = rateLimit({
    skip: () => false, // or add your own logic for skipping rate limiting
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour'
})

// app.use(multer({ storage : multerStorage}).fields([{name:'files[]',maxCount:20}]));

app.set('trust proxy', 1);
app.use('/api', limiter)



// disable queries in json
app.use(mongoSanitize())

// disabling html sending
app.use(xss())

// prevent multiple parameters
app.use(hpp({
    whitelist: []
}))


app.use('/api', express.static('public'));

// ROUTES2
app.use('/api/v1/payments', paymentRouter)
app.use('/api/v1/cards', cardRouter)
app.use('/api/v1/users', userRoutes)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} in this server`, 404))
})

app.use(globalErrorHandler)
