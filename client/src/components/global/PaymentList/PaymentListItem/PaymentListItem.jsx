import React from 'react';
import styles from "./PaymentListItem.module.scss";
import {formatDate} from "../../../../utils/functions/date";
import SecondaryBtn from "../../../layout/SecondaryBtn/SecondaryBtn";
import {paymentStatuses, userRoles} from "../../../../constants";
import {updatePaymentStatus} from "../../../../redux/action/payments";
import {useDispatch, useSelector} from "react-redux";
import {setCardAmount} from "../../../../utils/functions/card";
import {deleteIcon, editIcon} from "../../../../assets/svg";
import Svg from "../../../layout/Svg/Svg";
import {useNavigate} from "react-router-dom";
import {editPaymentPagePath} from "../../../../router/path";

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
                             notModalTexts,
                             openDeleteSimpleModal,
                             card
                         }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)

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
        dispatch(updatePaymentStatus(
            id,
            paymentStatuses.submitted,
            () => openNotModal(notModalTexts.submit))
        )
    }


    const onAcceptPayment = (id) => {
        dispatch(updatePaymentStatus(
            id,
            paymentStatuses.accepted,
            () => openNotModal(notModalTexts.accept)
        ))
    }

    const editPaymentPath = `${editPaymentPagePath}/${_id}?card=${card}`


    return (
        <div className={styles["paymentListItem"]} key={_id}>
            <div className={styles["paymentListItem__actions"]}>
                {
                    user.role === userRoles.employee && status !== paymentStatuses.accepted ?
                        <button
                            onClick={() => navigate(editPaymentPath)}
                            className={styles["paymentListItem__editBtn"]}>
                            <Svg id={editIcon} className={styles["paymentListItem__editIcon"]}/>
                        </button> : null
                }
                {
                    user.role === userRoles.employee && status === paymentStatuses.accepted ?
                        null :
                        <button
                            onClick={() => openDeleteSimpleModal(_id)}
                            className={styles["paymentListItem__deleteBtn"]}>
                            <Svg id={deleteIcon} className={styles["paymentListItem__deleteIcon"]}/>
                        </button>
                }
            </div>

            <h4 className={styles["paymentListItem__mainText"]}><span
                className="blueText">Дата: </span>
                {formatDate(date)}</h4>
            <h4 className={styles["paymentListItem__mainText"]}><span
                className="blueText">Сумма: </span><span className="noWrap">{setCardAmount(amount)}{'\u00a0'}UZS</span>
            </h4>
            <br/>
            <p className={styles["paymentListItem__secText"]}><span
                className="blueText">Предмет: </span>{subject}</p>
            <p className={styles["paymentListItem__secText"]}><span
                className="blueText">Цель: </span>{purpose}</p>
            <p className={styles["paymentListItem__secText"]}><span
                className="blueText">Номер операции: </span>{checkNum}</p>
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
                >Документы на списание
                </button>
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