import React from 'react';
import {addUsers} from "../../../../redux/action/users";
import {useDispatch, useSelector} from "react-redux";

import AddFormPopup from "../AddFormPopup/AddFormPopup";

const addEmployeeFields = [
    {
        placeholder: "ФИО",
        key: "fullName"
    },
    {
        placeholder: "Логин",
        key: "username"
    },
    {
        placeholder: "Пароль",
        key: "password"
    },
]

function AddEmployeePopup({onClose,show}) {
    const dispatch = useDispatch()

    const loading = useSelector(state => state.users.addLoading)
    const error = useSelector(state => state.users.addError)


    const onAddUser = (data,onClose) => {
        dispatch(addUsers(data,onClose))
    }

    return (
        <AddFormPopup
            loading={loading}
            error={error}
            show={show}
            onClose={onClose}
            fields={addEmployeeFields}
            onSubmit={onAddUser}
            title={'Добавить Сотрудника'}
        />
    );
}

export default AddEmployeePopup;