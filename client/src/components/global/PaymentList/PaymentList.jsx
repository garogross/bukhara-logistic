import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {getPayments, hideAddNotPopup, initPaymentParams} from "../../../redux/action/payments";
import {setCardNumText} from "../../../utils/functions/card";
import {getCards} from "../../../redux/action/cards";

import SecondaryBtn from "../../layout/SecondaryBtn/SecondaryBtn";
import PaymentFilterModal from "./PaymentFilterModal/PaymentFilterModal";
import PaymentFilesModal from "./PaymentFilesModal/PaymentFilesModal";
import LoadingPopup from "../../layout/LoadingPopup/LoadingPopup";
import DataLoader from "../../layout/DataLoader/DataLoader";

import {paginationItemCount} from "../../../constants";
import {addPaymentPagePath} from "../../../router/path";
import styles from "./PaymentList.module.scss"
import PaymentListItem from "./PaymentListItem/PaymentListItem";
import NotPopup from "../../layout/NotPopup/NotPopup";
import PaymentListPagination from "./PaymentListPagination/PaymentListPagination";
import {scrollTop} from "../../../utils/functions/scrollTop";
import PaymentDeleteModal from "./PaymentDeleteModal/PaymentDeleteModal";
import BackBtn from "../../layout/BackBtn/BackBtn";
import PaymentDeleteSimpleModal from "./PaymentDeleteSimpleModal/PaymentDeleteSimpleModal";
import Accordion from "../../layout/Accordion/Accordion";
import YearsListWrapper from "../YearsListWrapper/YearsListWrapper";


const notModalTexts = {
    add: "Списание Добовлено",
    filter: "Фильтры Сохранены",
    submit: "Списание Сдано",
    accept: "Списание Принято",
    delete: "Списания удалены",
    deleteSimple: "Списание удалено",
}

const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
];


function PaymentList({isAdmin}) {
    const dispatch = useDispatch()
    const {id} = useParams()
    const navigate = useNavigate()

    const cards = useSelector(state => state.cards.data)
    const cardLoading = useSelector(state => state.cards.getLoading)
    const getLoading = useSelector(state => state.payments.getLoading)
    const updateLoading = useSelector(state => state.payments.updateStatusLoading)
    const payments = useSelector(state => state.payments.data)
    const isAddNotShowing = useSelector(state => state.payments.isAddNotShowing)
    const totalCount = useSelector(state => state.payments.totalCount)

    const [filterModalOpened, setFilterModalOpened] = useState(false)
    const [deleteModalOpened, setDeleteModalOpened] = useState(false)
    const [deleteModalOpenedId, setDeleteModalOpenedId] = useState(null)
    const [notModalText, setNotModalText] = useState("")
    const [filesModalId, setFilesModalId] = useState(null)

    const filteredData = payments.filter(item => item.card === id)
    const curCard = cards.find(item => item._id === id)
    const curFiles = payments.find(item => item._id === filesModalId)?.files

    const dateSortedData = months.map((item, index) => {
        const data = filteredData.filter(payment => new Date(payment.date).getMonth() === index)

        if (!data.length) return undefined;
        else return {
            title: item,
            data
        }

    })
        .filter(item => item)

    useEffect(() => {
        if (!cards.length) dispatch(getCards())
        if (!filteredData.length) dispatch(getPayments(id))
        if (isAddNotShowing) openNotModal("Списание Добовлено")
        scrollTop()

        return () => {
            dispatch(initPaymentParams())
        }
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
    const closeDeleteSimpleModal = () => setDeleteModalOpenedId(null)
    const openDeleteSimpleModal = (id) => setDeleteModalOpenedId(id)
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
    }

    const onChangeYear = () => {
        dispatch(getPayments(id))
    }

    return (
        <>
            <div className={`${styles["paymentList"]} topDistanceBlock`}>
                <BackBtn/>
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
                <YearsListWrapper loading={getLoading} onChange={onChangeYear}>
                    {
                        curCard && dateSortedData.length ?
                            <div className={`blackBox`}>
                                {
                                    dateSortedData.map(({title, data}, index) => (
                                        <Accordion
                                            key={title}
                                            title={title}
                                            index={index}
                                        >
                                            <div className={styles["paymentList__main"]}>
                                                {
                                                    data.map(item => (
                                                        <PaymentListItem
                                                            {...item}
                                                            key={item._id}
                                                            openFilesModal={openFilesModal}
                                                            openNotModal={openNotModal}
                                                            isAdmin={isAdmin}
                                                            notModalTexts={notModalTexts}
                                                            openDeleteSimpleModal={openDeleteSimpleModal}
                                                        />))
                                                }
                                            </div>
                                        </Accordion>
                                    ))
                                }
                            </div>
                            :
                            <DataLoader loading={cardLoading || getLoading} isEmpty={!curCard || !filteredData.length}/>
                    }
                </YearsListWrapper>
                {
                    totalCount > paginationItemCount ?
                        <PaymentListPagination
                            totalCount={totalCount}
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
            <PaymentDeleteSimpleModal
                id={deleteModalOpenedId}
                openNotModal={() => openNotModal(notModalTexts.deleteSimple)}
                onClose={closeDeleteSimpleModal}
            />
        </>
    );

}

export default PaymentList;

