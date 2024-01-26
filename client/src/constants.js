export const paymentStatuses = {
    notSubmitted: "Нe сдано",
    submitted: "Сдано",
    accepted: "Принято",
}

export const userRoles = {
    employee: "employee",
    admin: "admin",
    superAdmin: "superAdmin",
}

export const paginationItemCount = 15

export const isProduction = process.env.NODE_ENV === "production"