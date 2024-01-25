import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addCard, setAddCardError} from "../../../../redux/action/cards";

import AddFormPopup from "../../../global/AddFormPopup/AddFormPopup";

const addCardFields = [
    {
        placeholder: "Номер Карты",
        key: "number",
        isCard: true
    },
]

function AddCardPopup({onClose,id}) {
    const dispatch = useDispatch()

    const loading = useSelector(state => state.cards.addLoading)
    const error = useSelector(state => state.cards.addError)
    const onAddCard = (data,onClose) => {
        const reqData = {
            owner: id,
            number: data.number
        }
        dispatch(addCard(reqData,onClose))
    }

    return (
        <AddFormPopup
            loading={loading}
            error={error}
            show={id}
            onClose={onClose}
            fields={addCardFields}
            setError={setAddCardError}
            onSubmit={onAddCard}
            title={'Добавить Карту'}

        />
    );
}

export default AddCardPopup;