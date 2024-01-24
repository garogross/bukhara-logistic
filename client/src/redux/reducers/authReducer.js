import {
    LOGIN_ERROR,
    LOGIN_LOADING_START,
    LOGIN_SUCCESS, LOGOUT_USER,
} from "../types";


const initialState = {
    token: null,
    user: null,
    loginLoading: false,
    loginError: null,
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
        default:
            return state
    }
}