export class AppError extends Error {
    constructor(message,statusCode,errors) {
        super(message)
        this.statusCode = statusCode,
        this.errors = errors || {},
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOptional = true

        // add stack to error
        Error.captureStackTrace(this,this.constructor)
    }
}