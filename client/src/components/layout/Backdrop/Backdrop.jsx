import React, {useEffect,memo} from 'react';

import TransitionProvider from "../../../providers/TransitionProvider";
import NewPortalProvider from "../../../providers/NewPortalProvider";

import styles from "./Backdrop.module.scss";

const Backdrop = memo(({inProp, onClose,highZIndex,enableScroll,className}) => {
    useEffect(() => {
        if (inProp && !enableScroll) document.body.style.overflowY = 'hidden'
        return () => document.body.style.overflowY = 'visible'
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inProp])
    return (
        <NewPortalProvider>
            <TransitionProvider
                className={className}
                inProp={inProp}
                // eslint-disable-next-line react/style-prop-object
                style={'opacity'}
            >
                <div className={`${styles['backdrop']} ${highZIndex ? styles['backdrop_high'] : styles['backdrop_low']}`}
                     onClick={onClose}></div>
            </TransitionProvider>
        </NewPortalProvider>

    );
})

export default Backdrop;