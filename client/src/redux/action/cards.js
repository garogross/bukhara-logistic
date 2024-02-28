import {
    ADD_CARDS_ERROR,
    ADD_CARDS_LOADING_START,
    ADD_CARDS_SUCCESS,
    DELETE_CARDS_ERROR,
    DELETE_CARDS_LOADING_START,
    DELETE_CARDS_SUCCESS,
    GET_CARDS_ERROR,
    GET_CARDS_LOADING_START,
    GET_CARDS_SUCCESS, UPDATE_CARD_STATUS_ERROR, UPDATE_CARD_STATUS_LOADING_START, UPDATE_CARD_STATUS_SUCCESS
} from "../types";
import {createCardsUrl, fetchRequest, getCardsUrl, setFormError} from "./fetchTools";


export const getCards = () => async (dispatch,getState) => {
    dispatch({type: GET_CARDS_LOADING_START})
    const curYear = getState().payments.curYear
    try {
        const fetchData = await fetchRequest(`${getCardsUrl}?year=${curYear}`)

        dispatch({type: GET_CARDS_SUCCESS,payload: fetchData.data})

    }catch (payload) {
        dispatch({type: GET_CARDS_ERROR, payload})
    }
}

export const saveNewCard = (item) => (dispatch,getState) => {
    const payload = [item,...getState().cards.data]
    dispatch({type: ADD_CARDS_SUCCESS,payload})
}
export const addCard = (formData,clb) => async (dispatch,getState) => {
    dispatch({type: ADD_CARDS_LOADING_START})
    try {
        const fetchData = await fetchRequest(createCardsUrl,"POST",JSON.stringify(formData))
        dispatch(saveNewCard({...fetchData.data,totalPayments: 0
        }))
        clb()
    }catch (payload) {
        dispatch(setFormError(ADD_CARDS_ERROR,payload))
    }
}

export const setAddCardError = (payload) => dispatch => dispatch(setFormError(ADD_CARDS_ERROR,payload))

export const deleteCard = (id,clb) => async (dispatch,getState) => {
    dispatch({type: DELETE_CARDS_LOADING_START})
    try {
        await fetchRequest(getCardsUrl+id,"DELETE")
        const cards = getState().cards.data
        const payload = cards.filter(item => item._id !== id)
        dispatch({type: DELETE_CARDS_SUCCESS,payload})
        clb()
    }catch (payload) {
        dispatch({type: DELETE_CARDS_ERROR,payload})
    }
}

export const updateCardTotalPayment = (newItem) => (dispatch,getState) => {
    const payload = [...getState().cards.data]

    const updatingIndex = payload.findIndex(item => item._id === newItem._id)

    if(updatingIndex !== -1) {
        payload[updatingIndex] = newItem
        dispatch({type: GET_CARDS_SUCCESS,payload})
    }
}

export const updateCardStatus = (id,isHidden) => async (dispatch,getState) => {
    dispatch({type: UPDATE_CARD_STATUS_LOADING_START})
    try {
        await fetchRequest(getCardsUrl+id,"PATCH",JSON.stringify({isHidden}))
        const cards = getState().cards.data
        const payload = [...cards]
        const updatingIndex = cards.findIndex(item => item._id === id)
        if(updatingIndex >= 0) {
            payload[updatingIndex] = {
                ...payload[updatingIndex],
                isHidden
            }
        }
        dispatch({type: UPDATE_CARD_STATUS_SUCCESS,payload})
    }catch (payload) {
        dispatch({type: UPDATE_CARD_STATUS_ERROR,payload})
    }
}