export const paymentStatuses = {
    notSubmitted: "Нe сдано",
    submitted: "Сдано",
    accepted: "Принято",
}

export const userRoles = {
    employee: "сотрудник",
    admin: "admin",
    superAdmin: "superAdmin",
}

export const paginationItemCount = 15

export const isProduction = process.env.NODE_ENV === "production"

export const imageTypes = [
    "jpg",
    "png",
    "webp",
    "jpeg",
    "gif",
    "svg",
]

export const todayYear = new Date().getFullYear()

export const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
];
