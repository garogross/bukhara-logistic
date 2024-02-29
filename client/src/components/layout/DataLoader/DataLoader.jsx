import React from 'react';

import Loader from "../Loader/Loader";
import TransitionProvider from "../../../providers/TransitionProvider";
import Svg from "../Svg/Svg";

import {emptyIcon} from "../../../assets/svg";
import styles from "./DataLoader.module.scss";

function DataLoader({loading,isEmpty}) {
    return (
        <TransitionProvider
            inProp={isEmpty}
            style={'opacity'}
            // height={'300px'}
            className={`${styles["dataLoader"]} blackBox`}
        >
            {
                loading ?
                    <Loader size={80} borderSize={8}/>
:
                    <Svg className={styles["dataLoader__emptyIcon"]} id={emptyIcon}/>
            }
        </TransitionProvider>
    );
}

export default DataLoader;