import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getCards} from "../../../redux/action/cards";
import {setCardAmount, setCardNumText} from "../../../utils/functions/card";

import DataLoader from "../../layout/DataLoader/DataLoader";

import {paymentsPagePath} from "../../../router/path";
import styles from "./MainCardsList.module.scss"
import YearsListWrapper from "../../global/YearsListWrapper/YearsListWrapper";
import {todayYear} from "../../../constants";


function MainCardsList() {
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const data = useSelector(state => state.cards.data)
    const loading = useSelector(state => state.cards.getLoading)
    const curYear = useSelector(state => state.payments.curYear)


    useEffect(() => {
        dispatch(getCards())
    }, []);

    const onClickItem = (id) => {
        navigate(`${paymentsPagePath}/${id}`)
    }

    return (
        <YearsListWrapper loading={loading} onChange={() => dispatch(getCards())}>
            <div className={styles["mainCardsList"]}>
                {
                    data.length ?
                        <div className={`${styles["mainCardsList__container"]} blackBox`}>
                            {
                                data.map(({number, totalMonthlyPayments, totalYearlyPayments, _id}, index) => (
                                    <div
                                        key={index}
                                        className={styles["mainCardsList__item"]}
                                        onClick={() => onClickItem(_id)}
                                    >
                                        <p className={styles["mainCardsList__text"]}>
                                            {setCardNumText(number)}
                                        </p>
                                        <div>
                                            <p className={styles["mainCardsList__text"]}>
                                                Сумма списаний за год - <span
                                                className="blueText noWrap">{setCardAmount(totalYearlyPayments)}{'\u00a0'}UZS</span>
                                            </p>
                                            {
                                                curYear === todayYear ?

                                                    <p className={styles["mainCardsList__text"]}>
                                                        Сумма списаний за месяц - <span
                                                        className="blueText noWrap">{setCardAmount(totalMonthlyPayments)}{'\u00a0'}UZS</span>
                                                    </p>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                ))
                            }

                        </div> :
                        null
                }
                <DataLoader loading={loading} isEmpty={!data.length}/>
            </div>
        </YearsListWrapper>
    );
}

export default MainCardsList;