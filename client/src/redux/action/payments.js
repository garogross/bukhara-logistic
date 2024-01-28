import {
    ADD_PAYMENT_ERROR,
    ADD_PAYMENT_LOADING_START,
    ADD_PAYMENT_SUCCESS,
    DELETE_PAYMENTS_ERROR,
    DELETE_PAYMENTS_LOADING_START,
    DELETE_PAYMENTS_SUCCESS,
    GET_PAYMENTS_ERROR,
    GET_PAYMENTS_LOADING_START,
    GET_PAYMENTS_SUCCESS,
    HIDE_ADD_NOT_POPUP,
    UPDATE_PAYMENT_ERROR,
    UPDATE_PAYMENT_LOADING_START,
    UPDATE_PAYMENT_SUCCESS
} from "../types";
import {
    authConfig,
    createPaymentsUrl,
    deletePaymentUrl,
    fetchRequest,
    getCardsUrl,
    getPaymentsUrl,
    setFormError
} from "./fetchTools";
import {paymentStatuses} from "../../constants";
import {isThisMonth} from "../../utils/functions/date";
import {updateCardTotalPayment} from "./cards";


export const getPayments = (id, page = 1, filters, clb) => async (dispatch) => {
    dispatch({type: GET_PAYMENTS_LOADING_START})
    try {
        let filtersQuery = ""
        if (filters) {
            for (let key in filters) {
                if (!filters[key]) continue;
                // if(key === "date") {
                //     const date = new Date(filters[key])
                //     filters[key] = date
                // }
                filtersQuery += `&${key}=${filters[key]}`
            }
        }
        const {data, totalCount} = await fetchRequest(`${getPaymentsUrl}${id}?page=${page}${filtersQuery}`)
        dispatch({type: GET_PAYMENTS_SUCCESS, payload: {data, totalCount}})
        if (clb) clb()
    } catch (payload) {
        console.error("err", payload)
        dispatch({type: GET_PAYMENTS_ERROR, payload})
    }
}
export const updatePayment = (id, status, clb) => async (dispatch, getState) => {
    dispatch({type: UPDATE_PAYMENT_LOADING_START})
    try {
        const reqData = {status}
        let acceptedBy = null
        if (status === paymentStatuses.accepted) {
            const {_id, fullName} = getState().auth.user
            reqData.acceptedBy = _id
            acceptedBy = {_id, fullName}
        }
        const fetchData = await fetchRequest(getPaymentsUrl + id, "PATCH", JSON.stringify(reqData))

        const payload = [...getState().payments.data]
        const updatingItemIndex = payload.findIndex(item => item._id === id)
        payload[updatingItemIndex] = acceptedBy ?
            {...fetchData.data, acceptedBy} :
            fetchData.data

        dispatch({type: UPDATE_PAYMENT_SUCCESS, payload})
        clb()
    } catch (payload) {
        console.error("err", payload)
        dispatch({type: UPDATE_PAYMENT_ERROR, payload})
    }
}

export const addPayment = (data, clb) => async (dispatch, getState) => {
    dispatch({type: ADD_PAYMENT_LOADING_START})
    try {
        const formData = new FormData()

        for (let key in data) {
            if (key === "files") {
                for (let i = 0; i < data.files.length; i++) {
                    formData.append('files[]', data.files[i])
                }
            } else {
                formData.append(key, data[key]);
            }
        }


        const {data: newItem} = await fetchRequest(createPaymentsUrl, "POST", formData, authConfig(true))
        const payload = [newItem, ...getState().payments.data]
        dispatch({type: ADD_PAYMENT_SUCCESS, payload})
        if (isThisMonth(newItem.date) && +newItem.amount > 0) {
            dispatch(updateCardTotalPayment(newItem.card, newItem.amount, true))
        }
        clb()
    } catch (payload) {
        console.error("err", payload.message)
        dispatch(setFormError(ADD_PAYMENT_ERROR, payload))
    }
}
export const setAddPaymentError = (payload) => dispatch => dispatch(setFormError(ADD_PAYMENT_ERROR, payload))

export const hideAddNotPopup = () => dispatch => {
    dispatch({type: HIDE_ADD_NOT_POPUP})
}


export const deletePayments = (formData, id, clb) => async (dispatch, getState) => {
    dispatch({type: DELETE_PAYMENTS_LOADING_START})
    try {
        const {data: payload} = await fetchRequest(getPaymentsUrl + id, "DELETE", JSON.stringify(formData))
        dispatch({type: DELETE_PAYMENTS_SUCCESS, payload})
        if (isThisMonth(formData.to, true)) {
            const amount = payload.filter(item => isThisMonth(item.date)).reduce((acc, cur) => {
                acc += cur.amount
                return acc
            }, 0)
            dispatch(updateCardTotalPayment(id, amount))
        }
        clb()
    } catch (payload) {
        console.error("err", payload.message)
        dispatch(setFormError(DELETE_PAYMENTS_ERROR, payload))
    }
}
export const setDeletePaymentError = (payload) => dispatch => dispatch(setFormError(DELETE_PAYMENTS_ERROR, payload))


export const deleteOnePayment = (id, clb) => async (dispatch, getState) => {
    dispatch({type: DELETE_PAYMENTS_LOADING_START})
    try {
        const {data: payload} = await fetchRequest(deletePaymentUrl + id, "DELETE")

        dispatch({type: DELETE_PAYMENTS_SUCCESS, payload})
        // if (isThisMonth(formData.to, true)) {
        //     const amount = payload.filter(item => isThisMonth(item.date)).reduce((acc, cur) => {
        //         acc += cur.amount
        //         return acc
        //     }, 0)
        //     dispatch(updateCardTotalPayment(id, amount))
        // }
        clb()
    } catch (payload) {
        console.error("err", payload.message)
        dispatch(setFormError(DELETE_PAYMENTS_ERROR, payload))
    }
}