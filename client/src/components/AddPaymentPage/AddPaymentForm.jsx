import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addPayment, setAddPaymentError} from "../../redux/action/payments";

import PaymentForm from "../global/PaymentForm/PaymentForm";

import {paymentsPagePath} from "../../router/path";
import {getCards} from "../../redux/action/cards";


function AddPaymentForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {id} = useParams()

    const cardLoading = useSelector(state => state.cards.getLoading)
    const cards = useSelector(state => state.cards.data)

    const addLoading = useSelector(state => state.payments.addLoading)
    const error = useSelector(state => state.payments.addError)
    const curItem = cards.find(item => item._id === id)


    useEffect(() => {
        if (!cards.length) dispatch(getCards())
    }, []);

    const onSubmit = (formData) => {

        const onSuccess = () => navigate(paymentsPagePath+"/"+id)
        dispatch(addPayment({...formData, card: id},onSuccess))
    }

    return (
        <PaymentForm
            title={'Добавление Списаний'}
            loading={addLoading}
            error={error}
            onSubmit={onSubmit}
            getLoading={cardLoading}
            curItem={curItem}
            setError={setAddPaymentError}
        />
    );
}

export default AddPaymentForm;