export const setCardNumText = (num) => {
    if(!num) return ""
    else if (num.startsWith('cash')) return "Cash (Наличка)"
    else return `Карта - ****\u00a0****\u00a0****\u00a0${num.slice(num.length - 4)}`
}

export const setCardAmount = (amount) => {
    if(!amount) return ""
    return  amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}