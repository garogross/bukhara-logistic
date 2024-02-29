import {
    ADD_CARDS_ERROR,
    ADD_CARDS_LOADING_START,
    LOGIN_ERROR,
    LOGIN_LOADING_START,
    LOGIN_SUCCESS,
    LOGOUT_USER,
    RESET_CARD_STATE,
    RESET_PAYMENT_STATE,
    RESET_USER_STATE, UPDATE_PASSWORD_ERROR,
    UPDATE_PASSWORD_LOADING_START,
    UPDATE_PASSWORD_SUCCESS,
} from "../types";
import {
    baseConfig, createCardsUrl,
    fetchRequest, setError, setFormError,
    siginUrl, updatePasUrl,
} from "./fetchTools";
import {getLSItem, removeLSItem, setLSItem} from "../../utils/functions/localStorage";
import {lsProps} from "../../utils/lsProps";
import {userRoles} from "../../constants";
import {saveNewCard} from "./cards";

export const login = (formData, clb) => async (dispatch) => {
    dispatch({type: LOGIN_LOADING_START})
    try {
        const {token, user} = await fetchRequest(siginUrl, "POST", JSON.stringify(formData), baseConfig)

        setLSItem(lsProps.token, token)
        setLSItem(lsProps.user, user)

        dispatch({type: LOGIN_SUCCESS, payload: {token, user}})
        clb(user.role === userRoles.admin)

    } catch (err) {
        console.error({err})
        dispatch({type: LOGIN_ERROR, payload: err})
    }
}

export const checkIsLoggedIn = () => (dispatch) => {
    const token = getLSItem(lsProps.token, true);
    const user = getLSItem(lsProps.user, true);

    if (token && user) {
        dispatch({type: LOGIN_SUCCESS, payload: {token, user}})
    }
}

export const logOut = (clb) => (dispatch) => {
    removeLSItem(lsProps.token)
    removeLSItem(lsProps.user)
    dispatch({type: LOGOUT_USER})
    dispatch({type: RESET_USER_STATE})
    dispatch({type: RESET_CARD_STATE})
    dispatch({type: RESET_PAYMENT_STATE})

    if (clb) clb()
}

export const updatePassword = (formData, clb) => async (dispatch) => {
    dispatch({type: UPDATE_PASSWORD_LOADING_START})
    try {
        const {token} = await fetchRequest(updatePasUrl, "PATCH", JSON.stringify(formData))
        dispatch({type: UPDATE_PASSWORD_SUCCESS, payload: token})
        setLSItem(lsProps.token, token)
        clb()
    } catch (payload) {
        dispatch(setFormError(UPDATE_PASSWORD_ERROR, payload))
    }
}

export const setUpdatePasError = (payload) => dispatch => dispatch(setFormError(UPDATE_PASSWORD_ERROR, payload))
