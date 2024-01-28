import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, getUsers} from "../../../redux/action/users";
import {setCardAmount, setCardNumText} from "../../../utils/functions/card";
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
import AdminEmployeesListItem from "./AdminEmployeesListItem/AdminEmployeesListItem";
import DeletePopup from "../../global/DeletePopup/DeletePopup";


function AdminEmployeesList() {
    const dispatch = useDispatch()

    const users = useSelector(state => state.users.data)
    const loading = useSelector(state => state.users.getLoading)
    const deleteUserLoading = useSelector(state => state.users.deleteLoading)
    const deleteCardLoading = useSelector(state => state.cards.deleteLoading)
    const addCardLoading = useSelector(state => state.cards.addLoading)
    const cards = useSelector(state => state.cards.data)

    const [addEmployeePopupOpened, setAddEmployeePopupOpened] = useState(false)
    const [addCardPopupOpenedId, setAddCardPopupOpenedId] = useState(null)
    const [deleteEmployeePopupOpenedId, setDeleteEmployeePopupOpenedId] = useState(false)
    const [deleteCardPopupOpenedId, setDeleteCardPopupOpenedId] = useState(null)

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
    const onOpenDeleteEmployeePopup = (id) => setDeleteEmployeePopupOpenedId(id)
    const onCloseDeleteEmployeePopup = () => setDeleteEmployeePopupOpenedId(null)
    const onOpenDeleteCardPopup = (id) => setDeleteCardPopupOpenedId(id)
    const onCloseDeleteCardPopup = () => setDeleteCardPopupOpenedId(null)


    const onDeleteCard = (id,onClose) => {
        dispatch(deleteCard(id,onClose))
    }

    const onDeleteUser = (id,onClose) => {
        dispatch(deleteUser(id,onClose))
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
                                data.map((item) => (
                                    <AdminEmployeesListItem
                                        {...item}
                                        key={item._id}
                                        onOpenAddCardPopup={onOpenAddCardPopup}
                                        onOpenDeleteCardPopup={onOpenDeleteCardPopup}
                                        onOpenDeleteEmployeePopup={onOpenDeleteEmployeePopup}
                                    />
                                ))
                            }

                        </div> :
                        <DataLoader loading={loading} isEmpty={!data.length}/>
                }
            </div>
            <LoadingPopup show={addCardLoading}/>
            <AddEmployeePopup
                show={addEmployeePopupOpened}
                onClose={onCloseAddEmployeePopup}
            />
            <AddCardPopup
                id={addCardPopupOpenedId}
                onClose={onCloseAddCardPopup}
            />
            <DeletePopup
                id={deleteEmployeePopupOpenedId}
                onClose={onCloseDeleteEmployeePopup}
                title={"Удалить Сотрудника"}
                loading={deleteUserLoading}
                onDelete={onDeleteUser}
            />
            <DeletePopup
                id={deleteCardPopupOpenedId}
                onClose={onCloseDeleteCardPopup}
                title={"Удалить Карту"}
                loading={deleteCardLoading}
                onDelete={onDeleteCard}
            />

        </>
    );
}

export default AdminEmployeesList;