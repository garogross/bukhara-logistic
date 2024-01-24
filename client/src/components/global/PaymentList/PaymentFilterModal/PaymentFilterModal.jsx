import React from 'react';
import {useFormValue} from "../../../../hooks/useFormValue";

import MainBtn from "../../../layout/MainBtn/MainBtn";
import MainInput from "../../../layout/MainInput/MainInput";
import Backdrop from "../../../layout/Backdrop/Backdrop";
import NewPortalProvider from "../../../../providers/NewPortalProvider";
import TransitionProvider from "../../../../providers/TransitionProvider";
import CrossBtn from "../../../layout/CrossBtn/CrossBtn";
import Select from "../../../layout/Select/Select";

import styles from "./PaymentFilterModal.module.scss"

function PaymentFilterModal({show, onClose, filters, initialData,updateFilters}) {

    const {onChange, formData, setFormData} = useFormValue(initialData)

    const onSubmit = (e) => {
        e.preventDefault()
        updateFilters(formData)
        onClose()
    }

    return (
        <>
            <Backdrop inProp={show} onClose={onClose} highZIndex={true}/>
            <NewPortalProvider>
                <TransitionProvider
                    className={styles["filterModal"]}
                    inProp={show}
                    style={'right'}
                >
                    <CrossBtn
                        btnClassName={styles['filterModal__crossBtn']}
                        onClick={onClose}
                    />
                    <form
                        className={`${styles["filterModal__container"]} scrollbarDef`}
                        method={'POST'}
                        onSubmit={onSubmit}
                    >
                        {
                            filters
                                .map(({
                                          key,
                                          type,
                                          name,
                                          options,
                                          selectValues,
                                          label,
                                          value,
                                    inputType
                                      }, index) => (
                                    <div
                                        key={index}
                                        className={styles["filterModal__item"]}
                                    >
                                        <h6 className={`${styles["filterModal__title"]} ${label ? styles["filterModal__title_withLabel"] : ''} contentTxt`}>{name}</h6>
                                        {
                                            type === 'select' ?
                                                <Select
                                                    disableState={false}
                                                    valuesArr={selectValues}
                                                    selectedValueProp={selectValues.find(item => item.value === formData.status) || null}
                                                    onChange={(value) => setFormData(prevState => ({
                                                        ...prevState,
                                                        status: value
                                                    }))}
                                                    name={'Пусто'}
                                                /> :
                                                <MainInput
                                                    type={inputType || "text"}
                                                    className={styles["filterModal__input"]}
                                                    value={formData[key]}
                                                    name={key}
                                                    onChange={onChange}
                                                />
                                        }
                                    </div>
                                ))
                        }
                        <div className={styles["filterModal__btnsBlock"]}>
                            <MainBtn
                                type={'button'}
                                onClick={onClose}
                                className={styles['filterModal__btn']}
                                isPassive={true}>Отменить</MainBtn>
                            <MainBtn
                                type={'submit'}
                                className={styles['filterModal__btn']}
                            >Создать фильтр</MainBtn>
                        </div>
                    </form>
                </TransitionProvider>
            </NewPortalProvider>
        </>
    );
}

export default PaymentFilterModal;