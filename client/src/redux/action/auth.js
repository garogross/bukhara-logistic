import {
    LOGIN_ERROR,
    LOGIN_LOADING_START,
    LOGIN_SUCCESS,
    LOGOUT_USER, RESET_CARD_STATE, RESET_PAYMENT_STATE, RESET_USER_STATE,
} from "../types";
import {
    baseConfig,
    fetchRequest, setError,
    siginUrl,
} from "./fetchTools";
import {getLSItem, removeLSItem, setLSItem} from "../../utils/functions/localStorage";
import {lsProps} from "../../utils/lsProps";

export const login = (formData, clb, isAdmin) => async (dispatch) => {
    dispatch({type: LOGIN_LOADING_START})
    try {
        const {token, user} = await fetchRequest(siginUrl, "POST", JSON.stringify(formData), baseConfig)

        if (!token || !user) setError('Не авторизован.')
        if (isAdmin && user.role !== "admin") setError('Этот пользователь не является админом.')
        if (!isAdmin && user.role === "admin") setError('Этот пользователь не является сотрудником.')

        setLSItem(lsProps.token, token)
        setLSItem(lsProps.user, user)

        dispatch({type: LOGIN_SUCCESS, payload: {token, user}})
        clb()

    } catch (err) {
        console.error({err})
        dispatch({type: LOGIN_ERROR, payload: err})
    }
}

export const checkIsLoggedIn = () => (dispatch) => {
    const token = getLSItem(lsProps.token,true);
    const user = getLSItem(lsProps.user,true);

    if(token && user) {
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
