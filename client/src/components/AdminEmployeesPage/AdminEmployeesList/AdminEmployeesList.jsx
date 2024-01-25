import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, getUsers} from "../../../redux/action/users";
import {setCardNumText} from "../../../utils/functions/card";
import {deleteCard} from "../../../redux/action/cards";
import {Link, useNavigate} from "react-router-dom";

import SecondaryBtn from "../../layout/SecondaryBtn/SecondaryBtn";
import Svg from "../../layout/Svg/Svg";
import DataLoader from "../../layout/DataLoader/DataLoader";
import AddCardPopup from "./AddCardPopup/AddCardPopup";
import LoadingPopup from "../../layout/LoadingPopup/LoadingPopup";
import AddEmployeePopup from "./AddEmployeePopup/AddEmployeePopup";

import {plusIcon} from "../../../assets/svg";
import {adminPaymentsPagePath} from "../../../router/path";
import styles from "./AdminEmployeesList.module.scss"
import {userRoles} from "../../../constants";
import {setUserFullName} from "../../../utils/functions/setUserFullName";


function AdminEmployeesList() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const users = useSelector(state => state.users.data)
    const loading = useSelector(state => state.users.getLoading)
    const deleteUserLoading = useSelector(state => state.users.deleteLoading)
    const deleteCardLoading = useSelector(state => state.cards.deleteLoading)
    const cards = useSelector(state => state.cards.data)
    const [addEmployeePopupOpened, setAddEmployeePopupOpened] = useState(false)
    const [addCardPopupOpenedId, setAddCardPopupOpenedId] = useState(null)

    const data = users.map(user => {
        const userCards = cards.filter(item => item.owner === user._id)
        const totalAmount = userCards.reduce((acc, cur) => {
            acc += cur.totalPayments
            return acc;
        }, 0)
        return {
            ...user,
            cards: userCards,
            totalAmount
        }
    })


    useEffect(() => {
        if (!users.length) dispatch(getUsers())
    }, []);

    const onOpenAddEmployeePopup = () => setAddEmployeePopupOpened(true)
    const onCloseAddEmployeePopup = () => setAddEmployeePopupOpened(false)
    const onOpenAddCardPopup = (id) => setAddCardPopupOpenedId(id)
    const onCloseAddCardPopup = () => setAddCardPopupOpenedId(null)


    const onDeleteUser = (id) => {
        dispatch(deleteUser(id))
    }

    const onDeleteCard = (id) => {
        dispatch(deleteCard(id))
    }

    const onClickItem = (e, cardId) => {
        if (e.target.tagName === "BUTTON") return;
        navigate(adminPaymentsPagePath + "/" + cardId)
    }
    return (
        <>
            <div className={`${styles["adminEmployeesList"]} topDistanceBlock`}>
                <h2 className={`titleTxt`}>Список Сотрудников</h2>
                <SecondaryBtn
                    className={styles["adminEmployeesList__addEmployeeBtn"]}
                    onClick={onOpenAddEmployeePopup}
                >Добавить Сотрудника</SecondaryBtn>
                {
                    !loading && data.length ?
                        <div className={`${styles["adminEmployeesList__main"]} blackBox`}>
                            {
                                data.map(({
                                              cards,
                                              totalAmount,
                                              _id,
                                              fullName,
                                              profession,
                                              role
                                          }) => (
                                    <div key={_id} className={styles["adminEmployeesList__item"]}>
                                        <div className={styles["adminEmployeesList__itemHeader"]}>
                                            <p className={`contentTxt`}>{setUserFullName(fullName,profession)}</p>
                                            <div className={styles["adminEmployeesList__ammountBlock"]}>
                                                {
                                                    role === userRoles.employee ?
                                                        <p className={`contentTxt`}>
                                                            Обшая Сумма списаний за месяц - <span
                                                            className="blueText">{totalAmount}{'\u00a0'}UZS</span></p>
                                                        : null
                                                }
                                                <button
                                                    onClick={() => onDeleteUser(_id)}
                                                    className={styles["adminEmployeesList__deleteBtn"]}>Удалить сотрудника
                                                </button>
                                            </div>
                                        </div>
                                        {
                                            role === userRoles.employee ?
                                                <div>
                                                    <div className={styles["adminEmployeesList__cardsBlockHeader"]}>
                                                        <h6 className={styles["adminEmployeesList__cardsTitle"]}>Карты</h6>
                                                        <button
                                                            className={styles["adminEmployeesList__addCardBtn"]}
                                                            onClick={() => onOpenAddCardPopup(_id)}
                                                        >
                                                            <Svg
                                                                className={styles["adminEmployeesList__plusIcon"]}
                                                                id={plusIcon}
                                                            />
                                                            <span
                                                                className={styles["adminEmployeesList__addCardBtnText"]}>Добавить Карту</span>
                                                        </button>
                                                    </div>
                                                    <div className={styles["adminEmployeesList__cardsList"]}>
                                                        {
                                                            cards.map(({_id: cardId, number, totalPayments}) => (
                                                                <div style={{cursor: "pointer"}}
                                                                     onClick={e => onClickItem(e, cardId)}
                                                                     key={cardId}
                                                                     className={styles["adminEmployeesList__cardItem"]}>
                                                                    <p className={`contentTxt`}>{setCardNumText(number)}</p>
                                                                    <div
                                                                        className={styles["adminEmployeesList__cardAmountBlock"]}>
                                                                        <p className={`contentTxt`}>Сумма
                                                                            списаний за месяц - <span
                                                                                className="blueText">{totalPayments}{'\u00a0'}UZS</span>
                                                                        </p>
                                                                        <button
                                                                            onClick={() => onDeleteCard(cardId)}
                                                                            className={styles["adminEmployeesList__deleteBtn"]}>Удалить
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
                                ))
                            }

                        </div> :
                        <DataLoader loading={loading} isEmpty={!data.length}/>
                }
            </div>
            <LoadingPopup show={deleteUserLoading || deleteCardLoading}/>
            <AddEmployeePopup
                show={addEmployeePopupOpened}
                onClose={onCloseAddEmployeePopup}
            />
            <AddCardPopup
                id={addCardPopupOpenedId}
                onClose={onCloseAddCardPopup}
            />
        </>
    );
}

export default AdminEmployeesList;