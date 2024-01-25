import React from 'react';
import AddFormPopup from "../../AddFormPopup/AddFormPopup";
import {useDispatch, useSelector} from "react-redux";
import {deletePayments, setDeletePaymentError} from "../../../../redux/action/payments";
import {useParams} from "react-router-dom";

const fields = [
    {
        placeholder: "От",
        key: "from",
        inputType: "date"
    },
    {
        placeholder: "До",
        key: "to",
        inputType: "date"
    },
]

function PaymentDeleteModal({show,onClose,openNotModal}) {
    const dispatch = useDispatch()
    const {id} = useParams()

    const loading = useSelector(state => state.payments.deleteLoading)
    const error = useSelector(state => state.payments.deleteError)
    const onSubmit = (formData,onClose) => {
        const onSuccess = () => {
            onClose()
            openNotModal()
        }
        dispatch(deletePayments(formData,id,onSuccess))
    }

    return (
        <AddFormPopup
            loading={loading}
            error={error}
            show={show}
            onClose={onClose}
            fields={fields}
            setError={setDeletePaymentError}
            onSubmit={onSubmit}
            title={'Удалить Списания'}

        />
    );
}

export default PaymentDeleteModal;