import React, {useEffect} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addPayment, getPayments, setAddPaymentError, updatePayment} from "../../redux/action/payments";

import PaymentForm from "../global/PaymentForm/PaymentForm";

import {paymentsPagePath} from "../../router/path";

function EditPaymentForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {id} = useParams()
    const {search} = useLocation()
    const cardId = search.replace('?card=',"")

    const getLoading = useSelector(state => state.payments.getLoading)
    const payments = useSelector(state => state.payments.data)

    const loading = useSelector(state => state.payments.updateLoading)
    const error = useSelector(state => state.payments.updateError)
    const curItem = payments.flatMap(item => item.data).find(item => item._id === id)

    let initialState = null

    if(curItem) {
        const {
            _id,
            acceptedBy,
            acceptedAt,
            submittedAt,
            id,
            ...initialData
        } = curItem
        initialState = initialData
    }

    useEffect(() => {
        if (!payments.length) dispatch(getPayments(cardId))
    }, []);

    const onSubmit = (formData) => {
        const onSuccess = () => navigate(paymentsPagePath+"/"+cardId)
        dispatch(updatePayment(formData,id,onSuccess))
    }

    return (
        <PaymentForm
            title={'Изменение Списаний'}
            loading={loading}
            error={error}
            curItem={curItem}
            getLoading={getLoading}
            onSubmit={onSubmit}
            setError={setAddPaymentError}
            initialState={initialState}
        />
    );
}

export default EditPaymentForm;