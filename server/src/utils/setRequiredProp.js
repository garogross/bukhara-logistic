export const setRequiredProp = function (name) {
    return {required: [true, `The ${name} is required`]}
}