import React from 'react';
import {useDispatch} from "react-redux";
import {setUserFullName} from "../../../../utils/functions/setUserFullName";
import {userRoles} from "../../../../constants";
import {setCardAmount, setCardNumText} from "../../../../utils/functions/card";
import Svg from "../../../layout/Svg/Svg";
import {plusIcon} from "../../../../assets/svg";
import {adminPaymentsPagePath} from "../../../../router/path";
import {useNavigate} from "react-router-dom";
import {addCard, deleteCard} from "../../../../redux/action/cards";
import {deleteUser} from "../../../../redux/action/users";
import styles from "./AdminEmployeesListItem.module.scss";

function AdminEmployeesListItem({
                                    cards,
                                    totalAmount,
                                    _id,
                                    fullName,
                                    profession,
                                    role,
                                    onOpenAddCardPopup,
                                }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isEmployee = role === userRoles.employee

    const onClickItem = (e, cardId) => {
        if (e.target.tagName === "BUTTON") return;
        navigate(adminPaymentsPagePath + "/" + cardId)
    }

    const onDeleteCard = (id) => {
        dispatch(deleteCard(id))
    }

    const onDeleteUser = (id) => {
        dispatch(deleteUser(id))
    }

    const onAddCash = (id) => {
        dispatch(addCard({
            owner: id,
            number: `cash-${id}`
        }))
    }


    return (
        <div key={_id} className={styles["adminEmployeesListItem"]}>
            <div className={styles["adminEmployeesListItem__header"]}>
                <p className={`contentTxt`}>{setUserFullName(fullName, profession)}</p>
                <div className={styles["adminEmployeesListItem__ammountBlock"]}>
                    {
                        isEmployee ?
                            <>
                                <button
                                    className={styles["adminEmployeesListItem__addCardBtn"]}
                                    onClick={() => onAddCash(_id)}
                                >
                                    <Svg
                                        className={styles["adminEmployeesListItem__plusIcon"]}
                                        id={plusIcon}
                                    />
                                    <span
                                        className={styles["adminEmployeesListItem__addCardBtnText"]}>Добавить Наличку</span>
                                </button>
                                <button
                                    className={styles["adminEmployeesListItem__addCardBtn"]}
                                    onClick={() => onOpenAddCardPopup(_id)}
                                >
                                    <Svg
                                        className={styles["adminEmployeesListItem__plusIcon"]}
                                        id={plusIcon}
                                    />
                                    <span
                                        className={styles["adminEmployeesListItem__addCardBtnText"]}>Добавить Карту</span>
                                </button>
                            </> : null
                    }
                    <button
                        onClick={() => onDeleteUser(_id)}
                        className={styles["adminEmployeesListItem__deleteBtn"]}>Удалить сотрудника
                    </button>
                </div>
            </div>
            {
                isEmployee ?
                    <div>
                        <div className={styles["adminEmployeesListItem__cardsBlockHeader"]}>
                            {
                                isEmployee ?
                                    <p className={`${styles["adminEmployeesListItem__amountText"]} contentTxt`}>
                                        Общая Сумма списаний за месяц - <span
                                        className="blueText noWrap">{setCardAmount(totalAmount)}{'\u00a0'}UZS</span></p>
                                    : null
                            }
                        </div>
                        <div className={styles["adminEmployeesListItem__cardsList"]}>
                        {
                                cards.map(({_id: cardId, number, totalPayments}) => (
                                    <div style={{cursor: "pointer"}}
                                         onClick={e => onClickItem(e, cardId)}
                                         key={cardId}
                                         className={styles["adminEmployeesListItem__cardItem"]}>
                                        <p className={`contentTxt`}>{setCardNumText(number)}</p>
                                        <div
                                            className={styles["adminEmployeesListItem__cardAmountBlock"]}>
                                            <p className={`contentTxt`}>Сумма
                                                списаний за месяц - <span
                                                    className="blueText noWrap">{setCardAmount(totalPayments)}{'\u00a0'}UZS</span>
                                            </p>
                                            <button
                                                onClick={() => onDeleteCard(cardId)}
                                                className={styles["adminEmployeesListItem__deleteBtn"]}>Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    : null
            }
        </div>
    );
}

export default AdminEmployeesListItem;