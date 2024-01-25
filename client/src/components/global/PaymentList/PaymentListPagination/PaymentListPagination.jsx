import React, {useState} from 'react';
import Pagination from "react-js-pagination";

import styles from "./PaymentListPagination.module.scss"
import {useDispatch} from "react-redux";
import {getPayments} from "../../../../redux/action/payments";
import {useParams} from "react-router-dom";
import {scrollTop} from "../../../../utils/functions/scrollTop";
import {paginationItemCount} from "../../../../constants";

function PaymentListPagination({totalCount,activePage,setActivePage}) {
    const dispatch = useDispatch()
    const {id} = useParams()


    const onPageChange = (page) => {
        setActivePage(page)
        dispatch(getPayments(id,page,null,scrollTop))
    }

    return (
        <div className={styles['paymentListPagination']}>
            <Pagination
                activePage={activePage}
                itemsCountPerPage={paginationItemCount}
                totalItemsCount={totalCount}
                pageRangeDisplayed={6}
                onChange={onPageChange}

                itemClassFirst={`${styles['paymentListPagination__item_arrow']} ${styles['paymentListPagination__item_first']}`}
                itemClassLast={`${styles['paymentListPagination__item_arrow']} ${styles['paymentListPagination__item_last']}`}
                linkClassFirst={styles['paymentListPagination__link_icon']}
                linkClassLast={styles['paymentListPagination__link_icon']}
                linkClassPrev={styles['paymentListPagination__link_icon']}
                linkClassNext={styles['paymentListPagination__link_icon']}
                itemClassPrev={`${styles['paymentListPagination__item_arrow']} ${styles['paymentListPagination__item_prev']}`}
                itemClassNext={`${styles['paymentListPagination__item_arrow']} ${styles['paymentListPagination__item_next']}`}
                disabledClass={styles['paymentListPagination__item_disabled']}
                activeLinkClass={styles['paymentListPagination__link_active']}
                activeClass={styles['paymentListPagination__item_active']}
                linkClass={styles['paymentListPagination__link']}
                innerClass={styles['paymentListPagination__container']}
                itemClass={styles['paymentListPagination__item']}
            />
        </div>
    );
}

export default PaymentListPagination;