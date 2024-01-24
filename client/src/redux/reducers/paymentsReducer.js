import {
    ADD_PAYMENT_ERROR,
    ADD_PAYMENT_LOADING_START,
    ADD_PAYMENT_SUCCESS,
    GET_PAYMENTS_ERROR,
    GET_PAYMENTS_LOADING_START,
    GET_PAYMENTS_SUCCESS,
    RESET_PAYMENT_STATE,
    RESET_USER_STATE,
    UPDATE_PAYMENT_ERROR,
    UPDATE_PAYMENT_LOADING_START,
    UPDATE_PAYMENT_SUCCESS
} from "../types";


const initialState = {
    data: [],
    getLoading: false,
    getError: null,
    updateLoading: false,
    updateError: null,
    addLoading: false,
    addError: null,
}

export const paymentsReducer = (state = initialState, action) => {
    const {type, payload} = action

    switch (type) {
        case GET_PAYMENTS_SUCCESS: {
            return {
                ...state,
                data: payload,
                getLoading: false
            }
        }
        case GET_PAYMENTS_LOADING_START: {
            return {
                ...state,
                getLoading: true,
                getError: null,
            }
        }
        case GET_PAYMENTS_ERROR: {
            return {
                ...state,
                getError: payload,
                getLoading: false
            }
        }
        case UPDATE_PAYMENT_SUCCESS: {
            return {
                ...state,
                data: payload,
                updateLoading: false
            }
        }
        case UPDATE_PAYMENT_LOADING_START: {
            return {
                ...state,
                updateLoading: true,
                updateError: null,
            }
        }
        case UPDATE_PAYMENT_ERROR: {
            return {
                ...state,
                updateError: payload,
                updateLoading: false
            }
        }
        case ADD_PAYMENT_SUCCESS: {
            return {
                ...state,
                data: payload,
                addLoading: false
            }
        }
        case ADD_PAYMENT_LOADING_START: {
            return {
                ...state,
                addLoading: true,
                addError: null,
            }
        }
        case ADD_PAYMENT_ERROR: {
            return {
                ...state,
                addError: payload,
                addLoading: false
            }
        }
        case RESET_PAYMENT_STATE: return initialState
        default:
            return state
    }
}