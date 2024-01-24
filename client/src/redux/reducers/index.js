import {combineReducers} from "redux"
import {authReducer} from "./authReducer";
import {cardsReducer} from "./cardsReducer";
import {paymentsReducer} from "./paymentsReducer";
import {usersReducer} from "./usersReducer";

export default combineReducers({
    auth: authReducer,
    cards: cardsReducer,
    payments: paymentsReducer,
    users: usersReducer
})