import {
    ADD_CARDS_ERROR,
    ADD_CARDS_LOADING_START,
    ADD_CARDS_SUCCESS,
    DELETE_CARDS_ERROR,
    DELETE_CARDS_LOADING_START,
    DELETE_CARDS_SUCCESS,
    GET_CARDS_ERROR,
    GET_CARDS_LOADING_START,
    GET_CARDS_SUCCESS,
    RESET_CARD_STATE,
    UPDATE_CARD_STATUS_ERROR, UPDATE_CARD_STATUS_LOADING_START,
    UPDATE_CARD_STATUS_SUCCESS
} from "../types";


const initialState = {
    data: [],
    getLoading: false,
    getError: null,
    addLoading: false,
    addError: null,
    deleteLoading: false,
    deleteError: null,
    updateStatusLoading: false,
    updateStatusError: null,
}

export const cardsReducer = (state = initialState, action) => {
    const {type, payload} = action

    switch (type) {
        case GET_CARDS_SUCCESS: {
            return {
                ...state,
                data: payload,
                getLoading: false
            }
        }
        case GET_CARDS_LOADING_START: {
            return {
                ...state,
                getLoading: true,
                getError: null,
            }
        }
        case GET_CARDS_ERROR: {
            return {
                ...state,
                getError: payload,
                getLoading: false
            }
        }
        case ADD_CARDS_SUCCESS: {
            return {
                ...state,
                data: payload,
                addLoading: false
            }
        }
        case ADD_CARDS_LOADING_START: {
            return {
                ...state,
                addLoading: true,
                addError: null,
            }
        }
        case ADD_CARDS_ERROR: {
            return {
                ...state,
                addError: payload,
                addLoading: false
            }
        }
        case DELETE_CARDS_SUCCESS: {
            return {
                ...state,
                data: payload,
                deleteLoading: false
            }
        }
        case DELETE_CARDS_LOADING_START: {
            return {
                ...state,
                deleteLoading: true,
                deleteError: null,
            }
        }
        case DELETE_CARDS_ERROR: {
            return {
                ...state,
                deleteError: payload,
                deleteLoading: false
            }
        }

        case UPDATE_CARD_STATUS_SUCCESS: {
            return {
                ...state,
                data: payload,
                updateStatusLoading: false
            }
        }
        case UPDATE_CARD_STATUS_LOADING_START: {
            return {
                ...state,
                updateStatusLoading: true,
                updateStatusError: null,
            }
        }
        case UPDATE_CARD_STATUS_ERROR: {
            return {
                ...state,
                updateStatusError: payload,
                updateStatusLoading: false
            }
        }

        case RESET_CARD_STATE: return initialState
        default:
            return state
    }
}