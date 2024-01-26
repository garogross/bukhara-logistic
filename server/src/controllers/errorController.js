import {AppError} from "../utils/appError.js";
import {nodeEnvTypes} from "../constants.js";

const sendErrDev = (error, res) => {
    const {status,message,stack,statusCode} = error
    res.status(statusCode).json({
        status,
        message,
        stack,
        error,
    })
}

const sendErrProd = (error, res) => {
    const {statusCode,status,message} = error
    res.status(statusCode).json({
        status,
        message,
        error
    })
}

const handleCastErrorDb = (err) => {
    const message = `invalid ${err.path}: ${err.value}`
    return new AppError(message,400)
}



const handleDuplicateError = (err) => {
    const entries = Object.entries(err.keyValue).map((item,_,arr) => `'${item[1]}' of field '${item[0]}'`).join(',')
    const message = `Duplicated value(s) ${entries}`
    return new AppError(message, 400,err.keyPattern)
}

const handleJWTError = () => new AppError('Invalid Token,please log in again',401)

const handleJWTExpiredError = () => new AppError('Your token has expired,please log in again',401)

export const globalErrorHandler = (err, req, res,next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    if (process.env.NODE_ENV === 'development') {
        sendErrDev(err, res)
    } else if (process.env.NODE_ENV === nodeEnvTypes.production) {
        let error = {...err}
        if(error.name === 'CastError') error = handleCastErrorDb(error)
        if(error.code === 11000) error = handleDuplicateError(error)
        if(error.name === 'JsonWebTokenError') error = handleJWTError()
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredError()
        else error = err
        sendErrProd(error, res)

    }
}
// duplicate error