import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useFormValue} from "../../../hooks/useFormValue";
import {getPayments, updatePayment} from "../../../redux/action/payments";
import {formatDate} from "../../../utils/functions/date";
import {setCardNumText} from "../../../utils/functions/card";
import {getCards} from "../../../redux/action/cards";

import SecondaryBtn from "../../layout/SecondaryBtn/SecondaryBtn";
import PaymentFilterModal from "./PaymentFilterModal/PaymentFilterModal";
import PaymentFilesModal from "./PaymentFilesModal/PaymentFilesModal";
import LoadingPopup from "../../layout/LoadingPopup/LoadingPopup";
import DataLoader from "../../layout/DataLoader/DataLoader";

import {paymentStatuses} from "../../../constants";
import {addPaymentPagePath} from "../../../router/path";
import styles from "./PaymentList.module.scss"

const filters = [
    {
        type: 'select',
        selectValues: Object.values(paymentStatuses).map(item => ({
            value: item,
            item: item[0].toUpperCase() + item.slice(1)
        })),
        key: 'status',
        name: 'Статус',
    },
    {
        type: 'input',
        key: 'subject',
        name: 'Предмет',
    },
    {
        type: 'input',
        key: 'purpose',
        name: 'Цель',
    },
    {
        type: 'input',
        key: 'date',
        inputType: "date",
        name: 'Дата',
    },
    {
        type: 'input',
        key: 'min_amount',
        inputType: "number",
        name: 'Мин. Сумма',
    },
    {
        type: 'input',
        key: 'max_amount',
        inputType: "number",
        name: 'Макс. Сумма',
    },
    {
        type: 'input',
        key: 'checkNum',
        name: 'Номер чека',
    },
]

const filterData = (formData, curPayments) => (
    curPayments.filter(({
                            status,
                            subject,
                            purpose,
                            date,
                            amount,
                            checkNum,
                        }) => (
        (!formData.status || status === formData.status) &&
        (!formData.subject || subject.includes(formData.subject)) &&
        (!formData.purpose || purpose.includes(formData.purpose)) &&
        (!formData.date || new Date(date) === new Date(formData.date)) &&
        (!formData.min_amount || amount >= formData.min_amount) &&
        (!formData.max_amount || amount <= formData.max_amount) &&
        (!formData.checkNum || checkNum === formData.checkNum)
    )))

function PaymentList({isAdmin}) {
    const dispatch = useDispatch()
    const {id} = useParams()
    const navigate = useNavigate()

    const cards = useSelector(state => state.cards.data)
    const cardLoading = useSelector(state => state.cards.getLoading)
    const getLoading = useSelector(state => state.payments.getLoading)
    const updateLoading = useSelector(state => state.payments.updateLoading)
    const payments = useSelector(state => state.payments.data)

    const [filterModalOpened, setFilterModalOpened] = useState(false)
    const [filesModalId, setFilesModalId] = useState(null)
    const initialData = filters.reduce((acc, cur) => {
        acc[cur.key] = ''
        return acc
    }, {})
    const {formData, setFormData} = useFormValue(initialData)


    const curPayments = payments.filter(item => item.card === id)
    const curCard = cards.find(item => item._id === id)
    const curFiles = payments.find(item => item._id === filesModalId)?.files

    useEffect(() => {
        if (!cards.length) dispatch(getCards())
        if (!curPayments.length) dispatch(getPayments(id))
    }, []);

    const closeFilterModal = () => setFilterModalOpened(false)
    const openFilterModal = () => setFilterModalOpened(true)
    const closeFilesModal = () => setFilesModalId(null)
    const openFilesModal = (id) => setFilesModalId(id)

    const onSubmitPayment = (id) => {
        dispatch(updatePayment(id, paymentStatuses.submitted))
    }

    const onAcceptPayment = (id) => {
        dispatch(updatePayment(id, paymentStatuses.accepted))
    }
    const filteredData = filterData(formData,curPayments)

    return (
        <>
            <div className={`${styles["paymentList"]} topDistanceBlock`}>
                <h2 className={`${styles["paymentList__title"]} titleTxt`}>Список Списаний</h2>
                <h6 className={`${styles["paymentList__subtitle"]} subtitleTxt`}>{setCardNumText(curCard?.number)}</h6>
                {
                    curCard ?
                        <div className={styles["paymentList__functions"]}>
                            {
                                !isAdmin ?
                                    <SecondaryBtn
                                        onClick={() => navigate(addPaymentPagePath+"/"+id)}
                                    >Добавить</SecondaryBtn> :
                                    <div></div>
                            }

                            <SecondaryBtn onClick={openFilterModal}>Filters</SecondaryBtn>
                        </div>
                        : null
                }
                {
                    curCard && filteredData.length ?
                        <div className={`${styles["paymentList__main"]} blackBox`}>
                            {
                                filteredData.map(({
                                                      _id,
                                                      subject,
                                                      purpose,
                                                      date,
                                                      amount,
                                                      checkNum,
                                                      comments,
                                                      status,
                                                  }) => {
                                    let
                                        submitBtnColor = "#5871F2",
                                        acceptBtnColor = "#64B550",
                                        submitBtnText = "Сдано",
                                        acceptBtnText = "Принято";

                                    const {notSubmitted, submitted, accepted} = paymentStatuses

                                    switch (status) {
                                        case notSubmitted: {
                                            submitBtnColor = "#8F9CCB"
                                            submitBtnText = isAdmin ? "Не сдано" : "Сдать"
                                            break;
                                        }
                                        case submitted: {
                                            acceptBtnColor = !isAdmin ? "#F85F5F" : "#8F9CCB"
                                            acceptBtnText = !isAdmin ? "Не принято" : "Принять"
                                            break;
                                        }
                                    }

                                    return (
                                        <div className={styles["paymentList__item"]} key={_id}>
                                            <h4 className={styles["paymentList__mainText"]}><span
                                                className="blueText">Дата: </span>
                                                {formatDate(date)}</h4>
                                            <h4 className={styles["paymentList__mainText"]}><span
                                                className="blueText">Сумма: </span>{amount} UZS</h4>
                                            <br/>
                                            <p className={styles["paymentList__secText"]}><span
                                                className="blueText">Предмет: </span>{subject}</p>
                                            <p className={styles["paymentList__secText"]}><span
                                                className="blueText">Цель: </span>{purpose}</p>
                                            <p className={styles["paymentList__secText"]}><span
                                                className="blueText">Номер чека: </span>{checkNum}</p>
                                            {
                                                comments ?
                                                    <p className={styles["paymentList__secText"]}><span
                                                        className="blueText">Коментарий: </span>{comments}</p>
                                                    : null
                                            }
                                            <div className={styles["paymentList__itemBottomBlock"]}>
                                                <button
                                                    onClick={() => openFilesModal(_id)}
                                                    className={styles["paymentList__filesBtn"]}
                                                >Файлы списания
                                                </button>
                                                <div className={styles["paymentList__itemStatusBtns"]}>
                                                    <SecondaryBtn
                                                        onClick={() => onSubmitPayment(_id)}
                                                        disabled={isAdmin || status !== paymentStatuses.notSubmitted}
                                                        style={{backgroundColor: submitBtnColor}}
                                                    >{submitBtnText}</SecondaryBtn>
                                                    {
                                                        status !== paymentStatuses.notSubmitted ?
                                                            <SecondaryBtn
                                                                onClick={() => onAcceptPayment(_id)}
                                                                disabled={!isAdmin || status !== paymentStatuses.submitted}
                                                                style={{backgroundColor: acceptBtnColor}}
                                                            >{acceptBtnText}</SecondaryBtn>
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                        :
                        <DataLoader loading={cardLoading || getLoading} isEmpty={!curCard || !filteredData.length}/>
                }

            </div>
            <PaymentFilterModal
                onClose={closeFilterModal}
                show={filterModalOpened}
                updateFilters={setFormData}
                initialData={formData}
                filters={filters}
            />
            {
                curFiles ?
                    <PaymentFilesModal
                        onClose={closeFilesModal}
                        curFiles={curFiles}
                    /> : null
            }
            <LoadingPopup show={updateLoading}/>
        </>
    );

}

export default PaymentList;

