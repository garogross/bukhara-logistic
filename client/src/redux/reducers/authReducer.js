import {
    LOGIN_ERROR,
    LOGIN_LOADING_START,
    LOGIN_SUCCESS, LOGOUT_USER, UPDATE_PASSWORD_ERROR, UPDATE_PASSWORD_LOADING_START, UPDATE_PASSWORD_SUCCESS,
} from "../types";


const initialState = {
    token: null,
    user: null,
    loginLoading: false,
    loginError: null,
    updatePasLoading: false,
    updatePasError: null,
}

export const authReducer = (state = initialState, action) => {
    const {type, payload} = action

    switch (type) {
        case LOGIN_SUCCESS: {
            return {
                ...state,
                user: payload.user,
                token: payload.token,
                loginLoading: false
            }
        }
        case LOGIN_LOADING_START: {
            return {
                ...state,
                loginLoading: true,
                loginError: null,
            }
        }
        case LOGIN_ERROR: {
            return {
                ...state,
                loginError: payload,
                loginLoading: false
            }
        }
        case LOGOUT_USER: {
            return {
                ...state,
                token: null,
                user: null,
            };
        }
        case UPDATE_PASSWORD_SUCCESS: {
            return {
                ...state,
                token: payload,
                updatePasLoading: false
            }
        }
        case UPDATE_PASSWORD_LOADING_START: {
            return {
                ...state,
                updatePasLoading: true,
                updatePasError: null,
            }
        }
        case UPDATE_PASSWORD_ERROR: {
            return {
                ...state,
                updatePasError: payload,
                updatePasLoading: false
            }
        }
        default:
            return state
    }
}