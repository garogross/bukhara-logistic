import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteOnePayment} from "../../../../redux/action/payments";
import DeletePopup from "../../DeletePopup/DeletePopup";


function PaymentDeleteSimpleModal({id,onClose,openNotModal}) {
    const dispatch = useDispatch()
    const loading = useSelector(state => state.payments.deleteLoading)
    const onDelete = (id,onClose) => {
        const onSuccess = () => {
            onClose()
            openNotModal()
        }
        dispatch(deleteOnePayment(id, onSuccess))
    }

    return (
            <DeletePopup
                title={'Удалить Списание'}
                loading={loading}
                onDelete={onDelete}
                id={id}
                onClose={onClose}
            />
    );
}

export default PaymentDeleteSimpleModal;