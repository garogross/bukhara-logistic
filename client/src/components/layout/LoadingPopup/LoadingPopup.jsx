import React from 'react';

import Backdrop from "../Backdrop/Backdrop";
import NewPortalProvider from "../../../providers/NewPortalProvider";
import TransitionProvider from "../../../providers/TransitionProvider";
import Loader from "../Loader/Loader";

import styles from "./LoadingPopup.module.scss"

function LoadingPopup({show}) {
    return (
        <>
            <Backdrop inProp={show}/>
            <NewPortalProvider>
                <TransitionProvider
                    className={styles["loadingPopup"]}
                    inProp={show}
                    style={'opacity'}
                >
                    <Loader/>
                </TransitionProvider>
            </NewPortalProvider>
        </>
);
}

export default LoadingPopup;