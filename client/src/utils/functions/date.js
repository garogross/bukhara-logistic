export function formatDate(dateStr) {
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

export const isThisMonth = (dateStr,isGte) => {
    const date = new Date(dateStr)
    const today = new Date()
    const dateYear = date.getFullYear()
    const todayYear = today.getFullYear()
    const dateMonth = date.getMonth()
    const todayMonth = today.getMonth()

    return isGte ?
        dateYear >= todayYear && dateMonth >= todayMonth :
        dateYear === todayYear && dateMonth === todayMonth
}