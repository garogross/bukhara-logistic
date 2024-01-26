import React from 'react';
import styles from "./PaymentListItem.module.scss";
import {formatDate} from "../../../../utils/functions/date";
import SecondaryBtn from "../../../layout/SecondaryBtn/SecondaryBtn";
import {paymentStatuses} from "../../../../constants";
import {updatePayment} from "../../../../redux/action/payments";
import {useDispatch} from "react-redux";
import {setCardAmount} from "../../../../utils/functions/card";

function PaymentListItem({
                             _id,
                             subject,
                             purpose,
                             date,
                             amount,
                             checkNum,
                             comments,
                             status,
                             acceptedBy,
                             acceptedAt,
                             submittedAt,
                             isAdmin,
                             openFilesModal,
                             openNotModal,
                             notModalTexts
                         }) {
    const dispatch = useDispatch()

    let
        submitBtnColor = "#5871F2",
        acceptBtnColor = "#64B550",
        submitBtnText = "Сдано",
        acceptBtnText = "Принято";

    const {notSubmitted, submitted} = paymentStatuses
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

    const onSubmitPayment = (id) => {
        dispatch(updatePayment(
            id,
            paymentStatuses.submitted,
            () => openNotModal(notModalTexts.submit))
        )
    }

    const onAcceptPayment = (id) => {
        dispatch(updatePayment(
            id,
            paymentStatuses.accepted,
            () => openNotModal(notModalTexts.accept)
        ))
    }

    return (
        <div className={styles["paymentListItem"]} key={_id}>
            <h4 className={styles["paymentListItem__mainText"]}><span
                className="blueText">Дата: </span>
                {formatDate(date)}</h4>
            <h4 className={styles["paymentListItem__mainText"]}><span
                className="blueText">Сумма: </span><span className="noWrap">{setCardAmount(amount)}{'\u00a0'}UZS</span></h4>
            <br/>
            <p className={styles["paymentListItem__secText"]}><span
                className="blueText">Предмет: </span>{subject}</p>
            <p className={styles["paymentListItem__secText"]}><span
                className="blueText">Цель: </span>{purpose}</p>
            <p className={styles["paymentListItem__secText"]}><span
                className="blueText">Номер чека: </span>{checkNum}</p>
            {
                comments ?
                    <p className={styles["paymentListItem__secText"]}><span
                        className="blueText">Коментарий: </span>{comments}</p>
                    : null
            }
            <div className={styles["paymentListItem__itemBottomBlock"]}>
                <button
                    onClick={() => openFilesModal(_id)}
                    className={styles["paymentListItem__filesBtn"]}
                >Документы на списание</button>
                <div className={styles["paymentListItem__itemStatusBtns"]}>
                    <div className={styles["paymentListItem__itemStatusBtnBlock"]}>
                        <SecondaryBtn
                            onClick={() => onSubmitPayment(_id)}
                            disabled={isAdmin || status !== paymentStatuses.notSubmitted}
                            style={{backgroundColor: submitBtnColor}}
                        >{submitBtnText}</SecondaryBtn>
                        {
                            status !== paymentStatuses.notSubmitted && submittedAt ?
                                <p
                                    className={styles["paymentListItem__itemStatusBtnDateText"]}
                                    style={{color: submitBtnColor}}
                                >{formatDate(submittedAt)}</p> : null
                        }
                    </div>

                    {
                        status !== paymentStatuses.notSubmitted ?
                            <div className={styles["paymentListItem__itemStatusBtnBlock"]}>
                                <SecondaryBtn
                                    onClick={() => onAcceptPayment(_id)}
                                    disabled={!isAdmin || status !== paymentStatuses.submitted}
                                    style={{backgroundColor: acceptBtnColor}}
                                >{acceptBtnText}</SecondaryBtn>
                                {
                                    status === paymentStatuses.accepted && acceptedAt ?
                                        <p
                                            className={styles["paymentListItem__itemStatusBtnDateText"]}
                                            style={{color: acceptBtnColor}}
                                        >{formatDate(acceptedAt)}</p> : null
                                }
                                {
                                    status === paymentStatuses.accepted && acceptedBy ?
                                        <p
                                            className={styles["paymentListItem__itemStatusBtnDateText"]}
                                            style={{color: acceptBtnColor}}
                                        >{acceptedBy.fullName}</p> : null
                                }
                            </div>
                            : null
                    }
                </div>
            </div>
        </div>
    );
}

export default PaymentListItem;