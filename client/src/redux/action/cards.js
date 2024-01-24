import {
    ADD_CARDS_ERROR,
    ADD_CARDS_LOADING_START,
    ADD_CARDS_SUCCESS,
    ADD_USERS_ERROR,
    ADD_USERS_LOADING_START,
    ADD_USERS_SUCCESS, DELETE_CARDS_ERROR,
    DELETE_CARDS_LOADING_START,
    DELETE_CARDS_SUCCESS,
    DELETE_USER_ERROR,
    DELETE_USER_LOADING_START,
    DELETE_USER_SUCCESS,
    GET_CARDS_ERROR,
    GET_CARDS_LOADING_START,
    GET_CARDS_SUCCESS
} from "../types";
import {createCardsUrl, fetchRequest, getCardsUrl, getUsersUrl, setFormError, signupUserUrl} from "./fetchTools";


export const getCards = () => async (dispatch) => {
    dispatch({type: GET_CARDS_LOADING_START})
    try {
        const fetchData = await fetchRequest(getCardsUrl)

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

export const deleteCard = (id) => async (dispatch,getState) => {
    dispatch({type: DELETE_CARDS_LOADING_START})
    try {
        await fetchRequest(getCardsUrl+id,"DELETE")
        const cards = getState().cards.data
        const payload = cards.filter(item => item._id !== id)
        dispatch({type: DELETE_CARDS_SUCCESS,payload})
    }catch (payload) {
        dispatch({type: DELETE_CARDS_ERROR,payload})
    }
}

export const updateCardTotalPayment = (id,amount) => (dispatch,getState) => {
    const payload = [...getState().cards.data]

    const updatingIndex = payload.findIndex(item => item._id === id)

    if(updatingIndex !== -1) {
        payload[updatingIndex] = {
            ...payload[updatingIndex],
            totalPayments: +payload[updatingIndex].totalPayments + amount
        }

        dispatch({type: GET_CARDS_SUCCESS,payload})
    }
}