

export const getLSItem = (key,isParse) => {
    const result = localStorage.getItem(key)
    if(isParse) {
        return result ? JSON.parse(result) : null
    } else {
        return result;
    }
}

export const setLSItem = (key,data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

export const removeLSItem = (key) => localStorage.removeItem(key)