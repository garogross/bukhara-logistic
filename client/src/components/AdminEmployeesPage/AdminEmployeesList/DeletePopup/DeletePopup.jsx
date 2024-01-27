import React, {Fragment} from 'react';

import Backdrop from "../../../layout/Backdrop/Backdrop";
import NewPortalProvider from "../../../../providers/NewPortalProvider";
import TransitionProvider from "../../../../providers/TransitionProvider";
import CrossBtn from "../../../layout/CrossBtn/CrossBtn";
import Loader from "../../../layout/Loader/Loader";
import MainBtn from "../../../layout/MainBtn/MainBtn";

import styles from "./DeletePopup.module.scss"

function DeletePopup({
                          id,
                          onClose,
                          title,
                          loading,
                          onDelete,
                      }) {
    const show = !!id

    const onDeleteItem = (id) => {
        onDelete(id,onClose)
    }

    return (
        <>
            <Backdrop onClose={onClose} inProp={show}/>
            <NewPortalProvider>
                <TransitionProvider
                    className={`${styles["deletePopup"]} popupBox`}
                    inProp={show}
                    style={'opacity'}
                >
                    <CrossBtn onClick={onClose}/>
                    <h4 className={`popupTitle`}>{title}</h4>
                    <TransitionProvider
                        inProp={loading}
                        style={"height"}
                        height={"36px"}
                    >
                        <Loader size={36} borderSize={4}/>
                    </TransitionProvider>
                    <div className={styles["deletePopup__btns"]}>
                        <MainBtn
                            onClick={onClose}
                            isPassive={true}
                            disabled={loading}
                        >Отменить</MainBtn>
                        <MainBtn
                            onClick={() => onDeleteItem(id)}
                            disabled={loading}
                            className={styles["deletePopup__deleteBtn"]}
                        >Удалить</MainBtn>
                    </div>
                </TransitionProvider>
            </NewPortalProvider>
        </>
    );
}

export default DeletePopup;