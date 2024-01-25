import {
    ADD_USERS_ERROR,
    ADD_USERS_LOADING_START,
    ADD_USERS_SUCCESS, DELETE_USER_ERROR, DELETE_USER_LOADING_START, DELETE_USER_SUCCESS,
    GET_USERS_ERROR,
    GET_USERS_LOADING_START,
    GET_USERS_SUCCESS, RESET_USER_STATE,
} from "../types";


const initialState = {
    data: [],
    getLoading: false,
    getError: null,
    addLoading: false,
    addError: null,
    deleteLoading: false,
    deleteError: null,
}

export const usersReducer = (state = initialState, action) => {
    const {type, payload} = action

    switch (type) {
        case GET_USERS_SUCCESS: {
            return {
                ...state,
                data: payload,
                getLoading: false
            }
        }
        case GET_USERS_LOADING_START: {
            return {
                ...state,
                getLoading: true,
                getError: null,
            }
        }
        case GET_USERS_ERROR: {
            return {
                ...state,
                getError: payload,
                getLoading: false
            }
        }
        case ADD_USERS_SUCCESS: {
            return {
                ...state,
                data: payload,
                addLoading: false
            }
        }
        case ADD_USERS_LOADING_START: {
            return {
                ...state,
                addLoading: true,
                addError: null,
            }
        }
        case ADD_USERS_ERROR: {
            return {
                ...state,
                addError: payload,
                addLoading: false
            }
        }
        case DELETE_USER_SUCCESS: {
            return {
                ...state,
                data: payload,
                deleteLoading: false
            }
        }
        case DELETE_USER_LOADING_START: {
            return {
                ...state,
                deleteLoading: true,
                deleteError: null,
            }
        }
        case DELETE_USER_ERROR: {
            return {
                ...state,
                deleteError: payload,
                deleteLoading: false
            }
        }

        case RESET_USER_STATE: return initialState
        default:
            return state
    }
}