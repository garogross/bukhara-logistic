import {
    ADD_USERS_ERROR,
    ADD_USERS_LOADING_START, ADD_USERS_SUCCESS, DELETE_USER_ERROR, DELETE_USER_LOADING_START, DELETE_USER_SUCCESS,
    GET_CARDS_SUCCESS,
    GET_USERS_ERROR,
    GET_USERS_LOADING_START, GET_USERS_SUCCESS
} from "../types";
import {fetchRequest, getCardsUrl, getUsersUrl, setFormError, signupUserUrl} from "./fetchTools";
import {saveNewCard} from "./cards";


export const getUsers = () => async (dispatch) => {
    dispatch({type: GET_USERS_LOADING_START})
    try {
        const fetchData = await fetchRequest(getUsersUrl)
        const {users,cards} = fetchData.data
        dispatch({type: GET_USERS_SUCCESS,payload: users})
        dispatch({type: GET_CARDS_SUCCESS,payload: cards})

    }catch (payload) {
        dispatch({type: GET_USERS_ERROR, payload})
    }
}

export const addUsers = (formData,clb) => async (dispatch,getState) => {
    dispatch({type: ADD_USERS_LOADING_START})
    try {
        const fetchData = await fetchRequest(signupUserUrl,"POST",JSON.stringify(formData))
      const user = fetchData.data
        const payload = [user,...getState().users.data]
        dispatch({type: ADD_USERS_SUCCESS,payload})
        dispatch(saveNewCard({...fetchData.cash,totalPayments: 0}))
        clb()
    }catch (payload) {
        dispatch(setFormError(ADD_USERS_ERROR,payload))
    }
}

export const setAddEmployeeError = (payload) => dispatch => dispatch(setFormError(ADD_USERS_ERROR,payload))

export const deleteUser = (id,clb) => async (dispatch,getState) => {
    dispatch({type: DELETE_USER_LOADING_START})
    try {
        await fetchRequest(getUsersUrl+id,"DELETE")
        const users = getState().users.data
        const payload = users.filter(item => item._id !== id)
        dispatch({type: DELETE_USER_SUCCESS,payload})
        clb()
    }catch (payload) {
        dispatch({type: DELETE_USER_ERROR,payload})
    }
}