import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getCards} from "../../../redux/action/cards";
import {setCardNumText} from "../../../utils/functions/card";

import DataLoader from "../../layout/DataLoader/DataLoader";

import {paymentsPagePath} from "../../../router/path";
import styles from "./MainCardsList.module.scss"



function MainCardsList() {
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const data = useSelector(state => state.cards.data)
    const loading = useSelector(state => state.cards.getLoading)


    useEffect(() => {
        if(!data.length) dispatch(getCards())
    }, []);

    const onClickItem = (id) => {
        navigate(`${paymentsPagePath}/${id}`)
    }

    return (
        <>
            {
                data.length ?
                    <div className={`${styles["mainCardsList"]} blackBox`}>
                        {
                            data.map(({number, totalPayments, _id}, index) => (
                                <div
                                    key={index}
                                    className={styles["mainCardsList__item"]}
                                    onClick={() => onClickItem(_id)}
                                >
                                    <p className={styles["mainCardsList__text"]}>
                                        {setCardNumText(number)}
                                    </p>
                                    <p className={styles["mainCardsList__text"]}>
                                        Сумма списаний за месяц - <span
                                        className="blueText">{totalPayments}{'\u00a0'}UZS</span>
                                    </p>
                                </div>
                            ))
                        }

                    </div> :
                    null
            }
            <DataLoader loading={loading} isEmpty={!data.length}/>
        </>
    );
}

export default MainCardsList;