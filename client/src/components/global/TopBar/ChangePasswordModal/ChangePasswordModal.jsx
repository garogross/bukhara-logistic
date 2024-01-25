import React from 'react';
import AddFormPopup from "../../AddFormPopup/AddFormPopup";
import {useDispatch, useSelector} from "react-redux";
import {setUpdatePasError, updatePassword} from "../../../../redux/action/auth";

const fields = [
    {
        placeholder: "Текущий пароль",
        key: "currentPassword",
    },
    {
        placeholder: "Новий пароль",
        key: "newPassword",
    },
]

function ChangePasswordModal({show,onClose}) {
    const dispatch = useDispatch()

    const loading = useSelector(state => state.auth.updatePasLoading)
    const error = useSelector(state => state.auth.updatePasError)
    const onSubmit = (data,onClose) => {
        dispatch(updatePassword(data,onClose))
    }
    return (
        <AddFormPopup
            loading={loading}
            error={error}
            show={show}
            onClose={onClose}
            fields={fields}
            setError={setUpdatePasError}
            onSubmit={onSubmit}
            title={'Изменить Пароль'}

        />
    );
}

export default ChangePasswordModal;