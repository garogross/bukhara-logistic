import React from 'react';

import NewPortalProvider from "../../../../providers/NewPortalProvider";
import Backdrop from "../../../layout/Backdrop/Backdrop";
import TransitionProvider from "../../../../providers/TransitionProvider";
import CrossBtn from "../../../layout/CrossBtn/CrossBtn";

import {baseUrl, downloadFileUrl, proxy} from "../../../../redux/action/fetchTools";
import styles from "./PaymentFilesModal.module.scss"

const imageTypes = [
    "jpg",
    "png",
    "webp",
    "jpeg",
    "gif",
    "svg",
]

function PaymentFilesModal({curFiles, onClose}) {
    const show = !!(curFiles)

    const imageFiles = curFiles.filter(item => imageTypes.some(type => item.endsWith(type)))
    const otherFiles = curFiles.filter(item => !imageTypes.some(type => item.endsWith(type)))

    const getFileName = (file) => file.replace("/files/", "")

    return (
        <>
            <Backdrop onClose={onClose} inProp={show}/>
            <NewPortalProvider>
                <TransitionProvider
                    className={`${styles['paymentFilesModal']} popupBox`}
                    style={'opacity'}
                    inProp={show}
                >
                    <CrossBtn onClick={onClose}/>
                    <h4 className={`popupTitle`}>Файлы списания</h4>
                    <div className={styles["paymentFilesModal__main"]}>
                        <div className={styles["paymentFilesModal__images"]}>
                            {
                                imageFiles.map(item => (
                                    <a
                                        key={item}
                                        href={`${proxy}${baseUrl}${downloadFileUrl}${getFileName(item)}`}
                                        download={getFileName(item)}
                                    >
                                    <img
                                        src={item}
                                        alt="file"
                                        className={styles["paymentFilesModal__img"]}
                                    />
                                    </a>
                                ))
                            }
                        </div>
                        <div className={styles["paymentFilesModal__files"]}>
                            {
                                otherFiles.map(item => (
                                    <a
                                        href={`${proxy}${baseUrl}${downloadFileUrl}${getFileName(item)}`}
                                        download={getFileName(item)}
                                        className={styles["paymentFilesModal__fileText"]}
                                        key={item}
                                    >{item.replace("/files/", "")}</a>
                                ))
                            }
                        </div>
                    </div>
                </TransitionProvider>
            </NewPortalProvider>
        </>
    );
}

export default PaymentFilesModal;