export const setUserFullName = (fullName,profession) => (
    `${fullName || ""}${profession ? ` (${profession})` : ""}`
)