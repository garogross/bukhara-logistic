import React from 'react';

import styles from "./BackBtn.module.scss"
import Svg from "../Svg/Svg";
import {arrowDownIcon} from "../../../assets/svg";
import {useNavigate} from "react-router-dom";

function BackBtn({to}) {
    const navigate = useNavigate()
    return (
        <button
            className={styles["backBtn"]}
            onClick={() => navigate(to || -1)}
        >
            <Svg id={arrowDownIcon} className={styles["backBtn__icon"]}/>
            <span>Назад</span>
        </button>
    );
}

export default BackBtn;