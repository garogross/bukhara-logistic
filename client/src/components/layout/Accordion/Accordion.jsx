
import styles from "./Accordion.module.scss";

const Accordion = ({title, children, onToggle,isActive}) => {

    return (
        <div className={`${styles['accordion']}`}>
            <div className={`${styles['accordion__container']} ${styles['accordion__container_active']}`}>
                <div onClick={onToggle}
                     className={`${styles['accordion__header']} ${isActive ? styles['accordion__header_active'] : ''}`}>
                    <h3 className={styles['accordion__title']}>{title}</h3>
                    <div
                        className={`${styles['accordion__icon']} ${isActive ? styles["accordion__icon_active"] : ''}`}>
                        <span
                            className={`${styles["accordion__iconItem"]} ${styles['accordion__iconItem_horizontal']}`}></span>
                        <span
                            className={`${styles["accordion__iconItem"]} ${styles["accordion__iconItem_vertical"]}`}></span>
                    </div>
                </div>

                <div
                    className={
                        `${styles['accordion__contentTextWrapper']} ` +
                        `${isActive ? styles['accordion__contentTextWrapper_active'] : ""}`
                    }
                >
                    <div className={styles['accordion__contentTextInner']}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Accordion