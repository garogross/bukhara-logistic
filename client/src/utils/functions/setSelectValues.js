export const setSelectValues = (obj) => Object.values(obj).map(item => ({
    value: item,
    item: item[0].toUpperCase() + item.slice(1)
}))