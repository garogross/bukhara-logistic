import {
    ADD_PAYMENT_ERROR,
    ADD_PAYMENT_LOADING_START,
    ADD_PAYMENT_SUCCESS, DELETE_PAYMENTS_ERROR, DELETE_PAYMENTS_LOADING_START, DELETE_PAYMENTS_SUCCESS,
    GET_PAYMENTS_ERROR,
    GET_PAYMENTS_LOADING_START,
    GET_PAYMENTS_SUCCESS, HIDE_ADD_NOT_POPUP,
    RESET_PAYMENT_STATE,
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
    daleteLoading: false,
    daleteError: null,
    isAddNotShowing: false,
    totalCount: 0,
}

export const paymentsReducer = (state = initialState, action) => {
    const {type, payload} = action

    switch (type) {
        case GET_PAYMENTS_SUCCESS: {
            return {
                ...state,
                data: payload.data,
                getLoading: false,
                totalCount: payload.totalCount === undefined ? state.totalCount : payload.totalCount
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
                addLoading: false,
                isAddNotShowing: true,
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
        case DELETE_PAYMENTS_SUCCESS: {
            return {
                ...state,
                data: payload,
                deleteLoading: false,
            }
        }
        case DELETE_PAYMENTS_LOADING_START: {
            return {
                ...state,
                deleteLoading: true,
                deleteError: null,
            }
        }
        case DELETE_PAYMENTS_ERROR: {
            return {
                ...state,
                deleteError: payload,
                deleteLoading: false
            }
        }
        case HIDE_ADD_NOT_POPUP: {
            return {
                ...state,
                isAddNotShowing: false
            }
        }
        case RESET_PAYMENT_STATE: return initialState
        default:
            return state
    }
}