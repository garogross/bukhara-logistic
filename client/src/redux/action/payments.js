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
    INIT_PAYMENT_PARAMS, SET_CUR_YEAR,
    SET_CUT_PAGE,
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
    setFormError, updatePaymentStatusUrl
} from "./fetchTools";
import {paymentStatuses} from "../../constants";


const getUrlWithFiltersQuery = (url) => (dispatch,getState) => {
    const filters = getState().payments.filters
    const page = getState().payments.curPage
    const year = getState().payments.curYear

    let filtersQuery = ""
    if (filters) {
        for (let key in filters) {
            if (!filters[key]) continue;
            filtersQuery += `&${key}=${filters[key]}`
        }
    }


    return `${url}?page=${page}&year=${year}&${filtersQuery}`
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
export const updatePaymentStatus = (id, status, clb) => async (dispatch, getState) => {
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
        const updatingItemIndex = payload.findIndex(item => item._id === id)
        payload[updatingItemIndex] = acceptedBy ?
            {...fetchData.data, acceptedBy} :
            fetchData.data

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

    const url = dispatch(getUrlWithFiltersQuery(createPaymentsUrl))
        const {data,totalCount} = await fetchRequest(url, "POST", formData, authConfig(true))
        dispatch({type: ADD_PAYMENT_SUCCESS, payload: {data,totalCount}})
        clb()
    } catch (payload) {
        console.error("err", payload.message)
        dispatch(setFormError(ADD_PAYMENT_ERROR, payload))
    }
}

export const updatePayment = (reqData,id, clb) => async (dispatch,getState) => {
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


        const {data} = await fetchRequest(`${getPaymentsUrl}${id}`, "PATCH", formData, authConfig(true))

        const payments = getState().payments.data

        const updatingIndex = payments.findIndex(item => item._id === id)

        if(updatingIndex !== -1) {
            const payload = [...payments]
            payload[updatingIndex] = data

            dispatch({type: UPDATE_PAYMENT_SUCCESS, payload})
        }
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


export const deletePayments = (formData, id, clb) => async (dispatch) => {
    dispatch({type: DELETE_PAYMENTS_LOADING_START})
    try {
        const {data,totalCount} = await fetchRequest(getPaymentsUrl + id, "DELETE", JSON.stringify(formData))
        dispatch({type: DELETE_PAYMENTS_SUCCESS, payload: {data,totalCount}})
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

        const {data,totalCount} = await fetchRequest(url, "DELETE")
        dispatch({type: DELETE_PAYMENTS_SUCCESS, payload: {data,totalCount}})
        clb()
    } catch (payload) {
        console.error("err", payload.message)
        dispatch(setFormError(DELETE_PAYMENTS_ERROR, payload))
    }
}

export const setPaymentFilters = (payload) => dispatch => dispatch({type: SET_PAYMENT_FILTERS,payload})
export const setPaymentCurPage = (payload) => dispatch => dispatch({type: SET_CUT_PAGE,payload})
export const setCurYear = (payload) => dispatch => dispatch({type: SET_CUR_YEAR,payload})
export const initPaymentParams = () => dispatch => dispatch({type: INIT_PAYMENT_PARAMS})