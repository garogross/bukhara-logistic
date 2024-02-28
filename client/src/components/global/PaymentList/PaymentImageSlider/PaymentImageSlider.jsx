import React, {useEffect, useState} from 'react';
import Slider from "react-slick";
import TransitionProvider from "../../../../providers/TransitionProvider";

import {downloadFilePath, getFileName, imagePath} from "../../../../utils/functions/files";

import styles from "./PaymentImageSlider.module.scss"
import CrossBtn from "../../../layout/CrossBtn/CrossBtn";
import SecondaryBtn from "../../../layout/SecondaryBtn/SecondaryBtn";
import NewPortalProvider from "../../../../providers/NewPortalProvider";
import Backdrop from "../../../layout/Backdrop/Backdrop";

const settings = {
    dots: false,
    autoplay: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    touchThreshold: 1000,
    arrows: true,
};

function PaymentImageSlider({showIndex, curFiles, onClose}) {
    const [isDragging, setIsDragging] = useState(false)
    const [isZoomed, setIsZoomed] = useState(false)
    const [activeIndex, setActiveIndex] = useState(showIndex || 0)
    const show = typeof showIndex === 'number'
    const files = curFiles || []

    useEffect(() => {
        changeActiveIndex(showIndex)
    }, [showIndex]);

    const toggleZoom = () => {
        if (!isDragging) setIsZoomed(prevState => !prevState)
    }

    const changeActiveIndex = (index) => {
        setIsDragging(false)
        setIsZoomed(false)
        setActiveIndex(index)
    }

    const sliderSettings = {
        ...settings,
        initialSlide: showIndex,
        afterChange: changeActiveIndex,
        beforeChange: () => setIsDragging(true),
    }

    return (
        <>
            <Backdrop onClose={onClose}/>
            <NewPortalProvider>
                <TransitionProvider
                    className={`${styles["imageSlider"]} popupBox`}
                    inProp={show}
                    style={'opacity'}
                >
                    <CrossBtn onClick={onClose} btnClassName={styles["imageSlider__crossBtn"]}/>
                    <Slider
                        {...sliderSettings}


                    >
                        {
                            files.map((item, index) => (
                                <div
                                    key={item}
                                    className={styles["imageSlider__item"]}>

                                    <img
                                        onClick={toggleZoom}
                                        src={imagePath(item)}
                                        alt={item}
                                        className={
                                            `${styles["imageSlider__img"]} ` +
                                            `${isZoomed && index === activeIndex ? styles["imageSlider__img_zoomed"] : ""}`}
                                    />
                                </div>
                            ))
                        }
                    </Slider>

                    {
                        curFiles[activeIndex] ?
                            <a
                                download={getFileName(curFiles[activeIndex])}
                                href={downloadFilePath(curFiles[activeIndex])}
                                className={styles["imageSlider__downloadBtn"]}
                            >
                                <SecondaryBtn
                                >Download</SecondaryBtn>
                            </a> : null
                    }
                </TransitionProvider>
            </NewPortalProvider>
        </>
    );
}

export default PaymentImageSlider;