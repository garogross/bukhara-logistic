import React from 'react';
import {addUsers, setAddEmployeeError} from "../../../../redux/action/users";
import {useDispatch, useSelector} from "react-redux";

import AddFormPopup from "../../../global/AddFormPopup/AddFormPopup";
import {setSelectValues} from "../../../../utils/functions/setSelectValues";
import {userRoles} from "../../../../constants";
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
    {
        placeholder: "Должность",
        key: "profession"
    },
    {
        type: 'select',
        selectValues: setSelectValues(userRoles).filter(item => item.value !== userRoles.superAdmin),
        key: "role"
    },
]


function AddEmployeePopup({onClose,show}) {
    const dispatch = useDispatch()

    const loading = useSelector(state => state.users.addLoading)
    const error = useSelector(state => state.users.addError)
    const user = useSelector(state => state.auth.user)



    const filteredAddEmployeeFields = !user || user.role !== userRoles.superAdmin ?
        addEmployeeFields.filter(item => item.type !== "select") :
        addEmployeeFields

    const onAddUser = (data,onClose) => {
        dispatch(addUsers(data,onClose))
    }

    return (
        <AddFormPopup
            loading={loading}
            error={error}
            show={show}
            onClose={onClose}
            fields={filteredAddEmployeeFields}
            onSubmit={onAddUser}
            setError={setAddEmployeeError}
            title={'Добавить Сотрудника'}
        />
    );
}

export default AddEmployeePopup;