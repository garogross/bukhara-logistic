import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteOnePayment} from "../../../../redux/action/payments";

import DeletePopup from "../../DeletePopup/DeletePopup";

import {paginationItemCount} from "../../../../constants";


function PaymentDeleteSimpleModal({id, onClose, openNotModal, monthIndex}) {
    const dispatch = useDispatch()
    const loading = useSelector(state => state.payments.deleteLoading)
    const data = useSelector(state => state.payments.data)
    const index = monthIndex >= 0 ? monthIndex : 0
    const {page, totalCount} = data[index]
    const onDelete = (id, onClose) => {
        const onSuccess = () => {
            onClose()
            openNotModal()
        }
        const curPage = !((totalCount - 1) % paginationItemCount) ? page - 1 : page
        dispatch(deleteOnePayment(id, monthIndex, curPage, onSuccess))
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