import React, {useState} from 'react';
import AddFormPopup from "../../AddFormPopup/AddFormPopup";
import {useDispatch, useSelector} from "react-redux";
import {deletePayments, setDeletePaymentError} from "../../../../redux/action/payments";
import {useParams} from "react-router-dom";
import DeletePopup from "../../DeletePopup/DeletePopup";

const fields = [
    {
        placeholder: "От",
        label: "Дата начала удаления (включительно)",
        key: "from",
        inputType: "date"
    },
    {
        placeholder: "До",
        label: "Конец удаления (включительно)",
        key: "to",
        inputType: "date"
    },
]

function PaymentDeleteModal({show,onClose,openNotModal,monthIndex}) {
    const dispatch = useDispatch()
    const {id} = useParams()

    const loading = useSelector(state => state.payments.deleteLoading)
    const error = useSelector(state => state.payments.deleteError)

    const [deleteDates,setDeleteDates] = useState(null)

    const closeDeletePopup = () => setDeleteDates(null)

    const onSubmit = (formData,onClose) => {
        setDeleteDates(formData)
        onClose()
    }

    const onDelete = (formData,onClose) => {
        const onSuccess = () => {
            onClose()
            openNotModal()
        }
        dispatch(deletePayments(formData, id,monthIndex, onSuccess))
    }

    return (
        <>
        <AddFormPopup
            loading={loading}
            error={error}
            show={show}
            onClose={onClose}
            fields={fields}
            btnText={"Удалить"}
            setError={setDeletePaymentError}
            onSubmit={onSubmit}
            title={'Удалить Списания'}
        />
            <DeletePopup
                title={'Удалить Списания'}
                loading={loading}
                onDelete={onDelete}
                id={deleteDates}
                onClose={closeDeletePopup}

            />
        </>
    );
}

export default PaymentDeleteModal;