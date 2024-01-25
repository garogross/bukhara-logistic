import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useFormValue} from "../../../hooks/useFormValue";
import {getPayments, hideAddNotPopup} from "../../../redux/action/payments";
import {setCardNumText} from "../../../utils/functions/card";
import {getCards} from "../../../redux/action/cards";

import SecondaryBtn from "../../layout/SecondaryBtn/SecondaryBtn";
import PaymentFilterModal from "./PaymentFilterModal/PaymentFilterModal";
import PaymentFilesModal from "./PaymentFilesModal/PaymentFilesModal";
import LoadingPopup from "../../layout/LoadingPopup/LoadingPopup";
import DataLoader from "../../layout/DataLoader/DataLoader";

import {paginationItemCount, paymentStatuses} from "../../../constants";
import {addPaymentPagePath} from "../../../router/path";
import styles from "./PaymentList.module.scss"
import {setSelectValues} from "../../../utils/functions/setSelectValues";
import PaymentListItem from "./PaymentListItem/PaymentListItem";
import NotPopup from "../../layout/NotPopup/NotPopup";
import PaymentListPagination from "./PaymentListPagination/PaymentListPagination";
import {scrollTop} from "../../../utils/functions/scrollTop";
import PaymentDeleteModal from "./PaymentDeleteModal/PaymentDeleteModal";


const notModalTexts = {
    add: "Списание Добовлено",
    filter: "Фильтры Сохранены",
    submit: "Списание Сдано",
    accept: "Списание Принято",
    delete: "Списания удалены",
}


function PaymentList({isAdmin}) {
    const dispatch = useDispatch()
    const {id} = useParams()
    const navigate = useNavigate()

    const cards = useSelector(state => state.cards.data)
    const cardLoading = useSelector(state => state.cards.getLoading)
    const getLoading = useSelector(state => state.payments.getLoading)
    const updateLoading = useSelector(state => state.payments.updateLoading)
    const payments = useSelector(state => state.payments.data)
    const isAddNotShowing = useSelector(state => state.payments.isAddNotShowing)
    const totalCount = useSelector(state => state.payments.totalCount)

    const [filterModalOpened, setFilterModalOpened] = useState(false)
    const [deleteModalOpened, setDeleteModalOpened] = useState(false)
    const [notModalText, setNotModalText] = useState("")
    const [filesModalId, setFilesModalId] = useState(null)
    const [activePage, setActivePage] = useState(1)

    const filteredData = payments.filter(item => item.card === id)
    const curCard = cards.find(item => item._id === id)
    const curFiles = payments.find(item => item._id === filesModalId)?.files

    useEffect(() => {
        if (!cards.length) dispatch(getCards())
        if (!filteredData.length) dispatch(getPayments(id))
        if (isAddNotShowing) openNotModal("Списание Добовлено")
        scrollTop()
    }, []);

    useEffect(() => {
        let timeOut = null
        if (notModalText) {
            timeOut = setTimeout(() => {
                if (notModalText === notModalTexts.add) onHideAddNotPopup()
                else closeNotModal()
            }, 3000)
        }
        if (!notModalText && timeOut) {
            clearTimeout(timeOut)
        }
    }, [notModalText]);

    const closeFilterModal = () => setFilterModalOpened(false)
    const openFilterModal = () => setFilterModalOpened(true)
    const closeDeleteModal = () => setDeleteModalOpened(false)
    const openDeleteModal = () => setDeleteModalOpened(true)
    const closeFilesModal = () => setFilesModalId(null)
    const openFilesModal = (id) => setFilesModalId(id)
    const closeNotModal = () => setNotModalText("")
    const openNotModal = (text) => setNotModalText(text)


    const onHideAddNotPopup = () => {
        dispatch(hideAddNotPopup())
        closeNotModal()
    }

    const onSaveFilters = () => {
        openNotModal(notModalTexts.filter)
        if (activePage !== 1) setActivePage(1)
    }

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
                                        onClick={() => navigate(addPaymentPagePath + "/" + id)}
                                    >Добавить</SecondaryBtn> :
                                    <SecondaryBtn
                                        onClick={openDeleteModal}
                                        className={styles["paymentList__deleteBtn"]}
                                    >Удалить Списания</SecondaryBtn>
                            }
                                <SecondaryBtn onClick={openFilterModal}>Фильтры</SecondaryBtn>
                        </div>
                        : null
                }
                {
                    curCard && filteredData.length ?
                        <div className={`${styles["paymentList__main"]} blackBox`}>
                            {
                                filteredData.map(item => (
                                    <PaymentListItem
                                        {...item}
                                        key={item._id}
                                        openFilesModal={openFilesModal}
                                        openNotModal={openNotModal}
                                        isAdmin={isAdmin}
                                        notModalTexts={notModalTexts}
                                    />))
                            }
                        </div>
                        :
                        <DataLoader loading={cardLoading || getLoading} isEmpty={!curCard || !filteredData.length}/>
                }
                {
                    totalCount > paginationItemCount ?
                        <PaymentListPagination
                            totalCount={totalCount}
                            activePage={activePage}
                            setActivePage={setActivePage}
                        />
                        : null
                }
            </div>
            <PaymentFilterModal
                id={id}
                onSaveFilters={onSaveFilters}
                onClose={closeFilterModal}
                show={filterModalOpened}
            />
            {
                isAdmin ?
                    <PaymentDeleteModal
                        show={deleteModalOpened}
                        onClose={closeDeleteModal}
                        openNotModal={() => openNotModal(notModalTexts.delete)}
                    />
                    : null
            }
            {
                curFiles ?
                    <PaymentFilesModal
                        onClose={closeFilesModal}
                        curFiles={curFiles}
                    /> : null
            }
            <LoadingPopup show={updateLoading}/>
            <NotPopup
                show={!!(notModalText)}
                onClose={onHideAddNotPopup}
                text={notModalText}
            />
        </>
    );

}

export default PaymentList;

