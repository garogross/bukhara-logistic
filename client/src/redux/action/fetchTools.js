import {getLSItem} from "../../utils/functions/localStorage";
import {lsProps} from "../../utils/lsProps";

export const baseUrl = '/api/v1';
export const proxy = "http://localhost:5000"

export const baseConfig = {
    headers: {
        'Content-Type': 'application/json',
    }
}

export const authConfig = (isFormData) => {
    const token = getLSItem(lsProps.token, true);
    const headers = {
        'Authorization': token ? `Bearer ${token}` : null,
    }

    if(!isFormData) {
        headers['Content-Type'] = 'application/json'
    }
    return {headers}
}


// auth
export const siginUrl = '/users/login'

// cards
export const getCardsUrl = '/cards/'
export const createCardsUrl = '/cards/create'

// payments
export const getPaymentsUrl = '/payments/'
export const createPaymentsUrl = '/payments/create/'
export const downloadFileUrl = '/payments/download/'

// users
export const getUsersUrl = '/users/'
export const signupUserUrl = '/users/signup'


export const fetchRequest = async (fetchUrl, method = 'GET', body = null, config = authConfig()) => {
    const response = await fetch(`${baseUrl}${fetchUrl}`, {
        method: method,
        body: body,
        ...config
    });
    const resData = await response.json();

    if (!response.ok) {
        // eslint-disable-next-line no-throw-literal
        throw {message: resData, status: response.status};
    }
    return resData
}

export const setError = (text) => {
    throw {
        message: {
            message: text
        }
    }
}

export const setFormError = (type,error) => dispatch => {
    const payload = error?.message?.error?.errors || error

    dispatch({type,payload})
}