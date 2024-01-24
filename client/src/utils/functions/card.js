export const setCardNumText = (num) => {
    if(!num) return ""
    else if (num.startsWith('cash')) return "Cash (Наличка)"
    else return `Карта - ****\u00a0****\u00a0****\u00a0${num.slice(num.length - 4)}`
}