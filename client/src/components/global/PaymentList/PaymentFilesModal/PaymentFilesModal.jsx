import React, {useState} from 'react';

import NewPortalProvider from "../../../../providers/NewPortalProvider";
import Backdrop from "../../../layout/Backdrop/Backdrop";
import TransitionProvider from "../../../../providers/TransitionProvider";
import CrossBtn from "../../../layout/CrossBtn/CrossBtn";

import styles from "./PaymentFilesModal.module.scss"
import {imageTypes} from "../../../../constants";
import {downloadFilePath, getFileName, imagePath} from "../../../../utils/functions/files";
import PaymentImageSlider from "../PaymentImageSlider/PaymentImageSlider";



function PaymentFilesModal({curFiles, onClose}) {
    const [isSliderOpened,setIsSliderOpened] = useState(null)
    const show = !!(curFiles)

    const imageFiles = curFiles.filter(item => imageTypes.some(type => item.endsWith(type)))
    const otherFiles = curFiles.filter(item => !imageTypes.some(type => item.endsWith(type)))

    const openSlider = (index) => setIsSliderOpened(index)
    const closeSlider = () => setIsSliderOpened(null)

    const onClickBackdrop = () => {
        isSliderOpened ? closeSlider() : onClose()
    }

    return (
        <>
            <Backdrop onClose={onClickBackdrop} inProp={show}/>
            <NewPortalProvider>
                <TransitionProvider
                    className={`${styles['paymentFilesModal']} popupBox`}
                    style={'opacity'}
                    inProp={show && !isSliderOpened}
                >
                    <CrossBtn onClick={onClose}/>
                    <h4 className={`popupTitle`}>Файлы списания</h4>
                    <div className={styles["paymentFilesModal__main"]}>
                        <div className={styles["paymentFilesModal__images"]}>
                            {
                                imageFiles.map((item,index) => (
                                    <button
                                        key={item}
                                        onClick={() => openSlider(index)}
                                        className={styles["paymentFilesModal__btn"]}
                                    >
                                        <img
                                            src={imagePath(item)}
                                            alt="file"
                                            className={styles["paymentFilesModal__img"]}
                                        />
                                    </button>
                                ))
                            }
                        </div>
                        <div className={styles["paymentFilesModal__files"]}>
                            {
                                otherFiles.map(item => (
                                    <a
                                        href={downloadFilePath(item)}
                                        download={getFileName(item)}
                                        className={styles["paymentFilesModal__fileText"]}
                                        key={item}
                                    >{getFileName(item)}</a>
                                ))
                            }
                        </div>
                    </div>
                </TransitionProvider>
                <PaymentImageSlider
                    curFiles={imageFiles}
                    showIndex={isSliderOpened}
                    onClose={closeSlider}
                />
            </NewPortalProvider>
        </>
    );
}

export default PaymentFilesModal;