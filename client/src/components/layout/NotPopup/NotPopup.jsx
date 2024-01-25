import React from 'react';
import Svg from "../../../layout/Svg/Svg";
import {crossIcon} from "../../../../assets/svg";
import styles from "./ArbitrageFilterNotPopup.module.scss"
import NewPortalProvider from "../../../../providers/NewPortalProvider";
import TransitionProvider from "../../../../providers/TransitionProvider";

function ArbitrageFilterNotPopup({show,onClose}) {
    return (
            <TransitionProvider
                style={'top'}
                inProp={show}
                className={styles["arbitrageFilterNotPopup"]}
            >
                <div className={styles["arbitrageFilterNotPopup__container"]}>
                    <p className={styles["arbitrageFilterNotPopup__text"]}>
                        Фильтр с заданными параметрами применен
                    </p>
                    <button
                        className={styles["arbitrageFilterNotPopup__btn"]}
                        onClick={onClose}
                    >
                        <Svg id={crossIcon} className={styles["arbitrageFilterNotPopup__crossIcon"]}/>
                    </button>
                </div>
            </TransitionProvider>
    );
}

export default ArbitrageFilterNotPopup;