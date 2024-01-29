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
    HIDE_ADD_NOT_POPUP, INIT_PAYMENT_PARAMS, SET_CUT_PAGE, SET_PAYMENT_FILTERS,
    UPDATE_PAYMENT_ERROR,
    UPDATE_PAYMENT_LOADING_START,
    UPDATE_PAYMENT_SUCCESS
} from "../types";
import {
    authConfig,
    createPaymentsUrl,
    deletePaymentUrl,
    fetchRequest,
    getPaymentsUrl,
    setFormError
} from "./fetchTools";
import {paymentStatuses} from "../../constants";
import {isThisMonth} from "../../utils/functions/date";
import {updateCardTotalPayment} from "./cards";


const getUrlWithFiltersQuery = (url) => (dispatch,getState) => {
    const filters = getState().payments.filters
    const page = getState().payments.curPage

    let filtersQuery = ""
    if (filters) {
        for (let key in filters) {
            if (!filters[key]) continue;
            filtersQuery += `&${key}=${filters[key]}`
        }
    }

    return `${url}?page=${page}${filtersQuery}`
}

export const getPayments = (id,clb) => async (dispatch) => {
    dispatch({type: GET_PAYMENTS_LOADING_START})
    try {
        const url = dispatch(getUrlWithFiltersQuery(`${getPaymentsUrl}${id}`))
        const {data, totalCount} = await fetchRequest(url)
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

export const addPayment = (reqData, clb) => async (dispatch) => {
    dispatch({type: ADD_PAYMENT_LOADING_START})
    try {
        const formData = new FormData()

        for (let key in reqData) {
            if (key === "files") {
                for (let i = 0; i < reqData.files.length; i++) {
                    formData.append('files[]', reqData.files[i])
                }
            } else {
                formData.append(key, reqData[key]);
            }
        }


        const {data,totalCount,card} = await fetchRequest(createPaymentsUrl, "POST", formData, authConfig(true))
        dispatch({type: ADD_PAYMENT_SUCCESS, payload: {data,totalCount}})
        if (isThisMonth(formData.date) && +formData.amount > 0) {
            dispatch(updateCardTotalPayment(card))
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


export const deletePayments = (formData, id, clb) => async (dispatch) => {
    dispatch({type: DELETE_PAYMENTS_LOADING_START})
    try {
        const {data,totalCount,card} = await fetchRequest(getPaymentsUrl + id, "DELETE", JSON.stringify(formData))
        dispatch({type: DELETE_PAYMENTS_SUCCESS, payload: {data,totalCount}})
        if (isThisMonth(formData.to, true)) {
            dispatch(updateCardTotalPayment(card))
        }
        dispatch(initPaymentParams())
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
        const url = dispatch(getUrlWithFiltersQuery(`${deletePaymentUrl}${id}`))

        const {data,totalCount,card} = await fetchRequest(url, "DELETE")
        const payments = getState().payments.data
        const curPayment = payments.find(item => item._id === id)
        if (isThisMonth(curPayment.date, true)) {
            dispatch(updateCardTotalPayment(card))
        }
        dispatch({type: DELETE_PAYMENTS_SUCCESS, payload: {data,totalCount}})
        clb()
    } catch (payload) {
        console.error("err", payload.message)
        dispatch(setFormError(DELETE_PAYMENTS_ERROR, payload))
    }
}

export const setPaymentFilters = (payload) => dispatch => dispatch({type: SET_PAYMENT_FILTERS,payload})
export const setPaymentCurPage = (payload) => dispatch => dispatch({type: SET_CUT_PAGE,payload})
export const initPaymentParams = () => dispatch => dispatch({type: INIT_PAYMENT_PARAMS})