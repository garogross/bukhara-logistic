import React from 'react';
import styles from "./NotPopup.module.scss"
import NewPortalProvider from "../../../providers/NewPortalProvider";
import TransitionProvider from "../../../providers/TransitionProvider";
import Svg from "../Svg/Svg";
import {crossIcon} from "../../../assets/svg";

function NotPopup({show,onClose,text}) {
    return (
        <NewPortalProvider>
            <TransitionProvider
                style={'top'}
                inProp={show}
                className={styles["notPopup"]}
            >
                <div className={styles["notPopup__container"]}>
                    <p className={styles["notPopup__text"]}>
                        {text}
                    </p>
                    <button
                        className={styles["notPopup__btn"]}
                        onClick={onClose}
                    >
                        <Svg id={crossIcon} className={styles["notPopup__crossIcon"]}/>
                    </button>
                </div>
            </TransitionProvider>
        </NewPortalProvider>
    );
}

export default NotPopup;