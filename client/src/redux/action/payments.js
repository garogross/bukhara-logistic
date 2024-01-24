import {
    ADD_PAYMENT_ERROR,
    ADD_PAYMENT_LOADING_START, ADD_PAYMENT_SUCCESS,
    GET_CARDS_ERROR,
    GET_CARDS_LOADING_START,
    GET_CARDS_SUCCESS, GET_PAYMENTS_ERROR,
    GET_PAYMENTS_LOADING_START,
    GET_PAYMENTS_SUCCESS, UPDATE_PAYMENT_LOADING_START, UPDATE_PAYMENT_SUCCESS
} from "../types";
import {authConfig, createPaymentsUrl, fetchRequest, getCardsUrl, getPaymentsUrl, setFormError} from "./fetchTools";
import {paymentStatuses} from "../../constants";
import {isThisMonth} from "../../utils/functions/date";
import {updateCards, updateCardTotalPayment} from "./cards";


export const getPayments = (id) => async (dispatch) => {
    dispatch({type: GET_PAYMENTS_LOADING_START})
    try {
        const fetchData = await fetchRequest(getPaymentsUrl + id)
        dispatch({type: GET_PAYMENTS_SUCCESS, payload: fetchData.data})

    } catch (payload) {
        console.error("err", payload)
        dispatch({type: GET_PAYMENTS_ERROR, payload})
    }
}
export const updatePayment = (id, status) => async (dispatch, getState) => {
    dispatch({type: UPDATE_PAYMENT_LOADING_START})
    try {
        const fetchData = await fetchRequest(getPaymentsUrl + id, "PATCH", JSON.stringify({status}))

        const payload = [...getState().payments.data]
        const updatingItemIndex = payload.findIndex(item => item._id === id)
        payload[updatingItemIndex] = fetchData.data

        dispatch({type: UPDATE_PAYMENT_SUCCESS, payload})

    } catch (payload) {
        console.error("err", payload)
        dispatch({type: GET_PAYMENTS_ERROR, payload})
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


        const {data: newItem} = await fetchRequest(createPaymentsUrl, "POST", formData,authConfig(true))
        const payload = [newItem, ...getState().payments.data]
        dispatch({type: ADD_PAYMENT_SUCCESS, payload})
        if(isThisMonth(newItem.date) && +newItem.amount > 0) {
            dispatch(updateCardTotalPayment(newItem.card,newItem.amount))
        }
        clb()
    } catch (payload) {
        console.error("err", payload.message)
        dispatch(setFormError(ADD_PAYMENT_ERROR,payload))
    }
}
export const setAddPaymentError = (payload) => dispatch => dispatch(setFormError(ADD_PAYMENT_ERROR,payload))
