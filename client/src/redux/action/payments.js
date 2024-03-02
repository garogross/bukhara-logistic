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
    INIT_PAYMENT_PARAMS,
    SET_CUR_YEAR,
    SET_PAYMENT_FILTERS,
    UPDATE_PAYMENT_ERROR,
    UPDATE_PAYMENT_LOADING_START,
    UPDATE_PAYMENT_STATUS_ERROR,
    UPDATE_PAYMENT_STATUS_LOADING_START,
    UPDATE_PAYMENT_STATUS_SUCCESS,
    UPDATE_PAYMENT_SUCCESS
} from "../types";
import {
    authConfig,
    createPaymentsUrl,
    deletePaymentUrl,
    fetchRequest,
    getPaymentsUrl,
    setFormError,
    updatePaymentStatusUrl
} from "./fetchTools";
import {paymentStatuses} from "../../constants";


const getUrlWithFiltersQuery = (url, monthIndex, page = 1) => (dispatch, getState) => {
    const filters = getState().payments.filters
    const year = getState().payments.curYear

    let filtersQuery = ""
    if (filters) {
        for (let key in filters) {
            if (!filters[key]) continue;
            filtersQuery += `&${key}=${filters[key]}`
        }
    }


    return `${url}?page=${page}&year=${year}&month=${monthIndex + 1}&${filtersQuery}`
}

export const savePayments = (data, index, totalCount, page, successType) => (dispatch, getState) => {
    if (index === -1) {
        dispatch({type: successType})
        return;
    }
    const payments = getState().payments.data
    const payload = [...payments]
    payload[index] = {
        data,
        totalCount,
        page
    }
    dispatch({type: successType, payload})
}

export const getPayments = (id, index, page = 1, clb) => async (dispatch, getState) => {
    dispatch({type: GET_PAYMENTS_LOADING_START, payload: index})
    try {
        const url = dispatch(getUrlWithFiltersQuery(`${getPaymentsUrl}${id}`, index, page))
        const {data, totalCount} = await fetchRequest(url)
        dispatch(savePayments(data, index, totalCount, page, GET_PAYMENTS_SUCCESS))
        if (clb) clb()
    } catch (payload) {
        console.error("err", payload)
        dispatch({type: GET_PAYMENTS_ERROR, payload})
    }
}
export const updatePaymentStatus = (id, monthIndex, status, clb) => async (dispatch, getState) => {
    dispatch({type: UPDATE_PAYMENT_STATUS_LOADING_START})
    try {
        const reqData = {status}
        let acceptedBy = null
        if (status === paymentStatuses.accepted) {
            const {_id, fullName} = getState().auth.user
            reqData.acceptedBy = _id
            acceptedBy = {_id, fullName}
        }
        const fetchData = await fetchRequest(updatePaymentStatusUrl + id, "PATCH", JSON.stringify(reqData))

        const payload = [...getState().payments.data]
        const updatingItemIndex = payload[monthIndex].data.findIndex(item => item._id === id)
        const monthData = payload[monthIndex].data
        monthData[updatingItemIndex] = acceptedBy ?
            {...fetchData.data, acceptedBy} :
            fetchData.data
        payload[monthIndex] = {
            ...payload[monthIndex],
            data: monthData
        }

        dispatch({type: UPDATE_PAYMENT_STATUS_SUCCESS, payload})
        clb()
    } catch (payload) {
        console.error("err", payload)
        dispatch({type: UPDATE_PAYMENT_STATUS_ERROR, payload})
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

        await fetchRequest(createPaymentsUrl, "POST", formData, authConfig(true))
        dispatch({type: ADD_PAYMENT_SUCCESS})
        clb()
    } catch (payload) {
        console.error("err", payload.message)
        dispatch(setFormError(ADD_PAYMENT_ERROR, payload))
    }
}

export const updatePayment = (reqData, id, clb) => async (dispatch, getState) => {
    dispatch({type: UPDATE_PAYMENT_LOADING_START})
    try {
        reqData.oldFiles = JSON.stringify(reqData.files.filter(item => typeof item === 'string'))
        reqData.files = reqData.files.filter(item => typeof item !== 'string')
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

        await fetchRequest(`${getPaymentsUrl}${id}`, "PATCH", formData, authConfig(true))

        dispatch({type: UPDATE_PAYMENT_SUCCESS})
        clb()
    } catch (payload) {
        console.error("err", payload.message)
        dispatch(setFormError(UPDATE_PAYMENT_ERROR, payload))
    }
}
export const setAddPaymentError = (payload) => dispatch => dispatch(setFormError(ADD_PAYMENT_ERROR, payload))

export const hideAddNotPopup = () => dispatch => {
    dispatch({type: HIDE_ADD_NOT_POPUP})
}


export const deletePayments = (formData, id, monthIndex, clb) => async (dispatch) => {
    dispatch({type: DELETE_PAYMENTS_LOADING_START})
    try {
        const url = dispatch(getUrlWithFiltersQuery(getPaymentsUrl + id, monthIndex))
        const {data, totalCount} = await fetchRequest(url, "DELETE", JSON.stringify(formData))
        dispatch(savePayments(data, monthIndex, totalCount, 1, DELETE_PAYMENTS_SUCCESS))

        dispatch(initPaymentParams())
        clb()
    } catch (payload) {
        console.error("err", payload.message)
        dispatch(setFormError(DELETE_PAYMENTS_ERROR, payload))
    }
}
export const setDeletePaymentError = (payload) => dispatch => dispatch(setFormError(DELETE_PAYMENTS_ERROR, payload))


export const deleteOnePayment = (id, monthIndex, page, clb) => async (dispatch) => {
    dispatch({type: DELETE_PAYMENTS_LOADING_START})
    try {
        const url = dispatch(getUrlWithFiltersQuery(`${deletePaymentUrl}${id}`, monthIndex, page))

        const {data, totalCount} = await fetchRequest(url, "DELETE")
        dispatch(savePayments(data, monthIndex, totalCount, page, DELETE_PAYMENTS_SUCCESS))
        clb()
    } catch (payload) {
        console.error("err", payload.message)
        dispatch(setFormError(DELETE_PAYMENTS_ERROR, payload))
    }
}


export const setPaymentFilters = (payload) => dispatch => dispatch({type: SET_PAYMENT_FILTERS, payload})
export const setCurYear = (payload) => dispatch => dispatch({type: SET_CUR_YEAR, payload})
export const initPaymentParams = () => dispatch => dispatch({type: INIT_PAYMENT_PARAMS})