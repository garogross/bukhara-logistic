import React from 'react';

import Svg from "../Svg/Svg";

import styles from "./CrossBtn.module.scss";
import {crossIcon} from "../../../assets/svg";

function CrossBtn({onClick, iconClassName, btnClassName, isPositionSet}) {
    return (
        <button
            className={`${styles["crossBtn"]} ` +
                `${btnClassName ? btnClassName : ""} ` +
                `${isPositionSet ? '' : styles["crossBtn_positionDef"]}`
            }
            onClick={onClick}
        >
            <Svg className={iconClassName ? iconClassName : styles["crossBtn__icon"]} id={crossIcon}/>
        </button>
    );
}

export default CrossBtn;