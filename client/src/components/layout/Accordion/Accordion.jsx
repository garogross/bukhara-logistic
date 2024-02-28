import React, { useState} from "react";

import DropdownProvider from "../../../providers/DropdownProvider";

import styles from "./Accordion.module.scss";

const Accordion = ({title, children, index,addHeight}) => {
    const [dropdownOpened, setDropdownOpened] = useState([])
    const onToggleDropdowns = (id) => {
        !dropdownOpened.includes(id) ?
            setDropdownOpened(prevState => [...prevState, id]) :
            setDropdownOpened(prevState => (prevState.filter(item => item !== id)))
    }
    return (
        <div className={`${styles['accordion']}`}>
            <div className={`${styles['accordion__container']} ${styles['accordion__container_active']}`}>
                <div onClick={() => onToggleDropdowns(index)} className={`${styles['accordion__header']} ${dropdownOpened.includes(index) ? styles['accordion__header_active'] : ''}`}>
                    <h3 className={styles['accordion__title']}>{title}</h3>
                    <div
                        className={`${styles['accordion__icon']} ${dropdownOpened.includes(index) ? styles["accordion__icon_active"] : ''}`}>
                        <span className={`${styles["accordion__iconItem"]} ${styles['accordion__iconItem_horizontal']}`}></span>
                        <span className={`${styles["accordion__iconItem"]} ${styles["accordion__iconItem_vertical"]}`}></span>
                    </div>
                </div>

                <DropdownProvider
                    className={styles['accordion__contentTextWrapper']}
                    inProp={dropdownOpened.includes(index)}
                    childClass={`${styles['accordion__contentText']} contentTextDef`}
                >
                    {children}
                </DropdownProvider>
            </div>
        </div>
    )
}
export default Accordion