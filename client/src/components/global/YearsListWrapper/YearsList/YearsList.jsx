import React from 'react';

import styles from "./YearsList.module.scss"
import {useDispatch, useSelector} from "react-redux";
import {todayYear} from "../../../../constants";
import {setCurYear} from "../../../../redux/action/payments";

function YearsList({onChange,loading}) {
    const dispatch = useDispatch()
    const curYear = useSelector(state => state.payments.curYear)

    const startYear = 2020
    const years = Array.from({length: todayYear - startYear}, (_, index) => todayYear - index)


    const onClick = (item) => {
        if(curYear === item) return;
        dispatch(setCurYear(item))
        onChange(item)
    }

    return (
        <div>
            <div className={`${styles["yearsList"]} scrollbarDef`}>
                {
                    years.map((item, index) => (
                        <button
                            disabled={loading}
                            onClick={() => onClick(item)}
                            key={index}
                            className={
                                `${styles["yearsList__item"]} ` +
                                `${curYear === item ? styles["yearsList__item_active"] : ''}`
                            }
                        >
                            {item}
                        </button>
                    ))
                }
            </div>
        </div>
    );
}

export default YearsList;