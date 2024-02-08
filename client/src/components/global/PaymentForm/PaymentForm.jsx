import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useFormValue} from "../../../hooks/useFormValue";
import {setCardNumText} from "../../../utils/functions/card";

import MainBtn from "../../layout/MainBtn/MainBtn";
import MainInput from "../../layout/MainInput/MainInput";
import LoadingPopup from "../../layout/LoadingPopup/LoadingPopup";
import DataLoader from "../../layout/DataLoader/DataLoader";
import Svg from "../../layout/Svg/Svg";

import {crossIcon} from "../../../assets/svg";
import styles from "./PaymentForm.module.scss"
import BackBtn from "../../layout/BackBtn/BackBtn";
import {getFileName} from "../../../utils/functions/files";


function PaymentForm({
                         error,
                         loading,
                         onSubmit,
                         title,
                         initialState,
                         setError,
                         curItem,
                         getLoading
                     }) {
    const [isStateLoaded,setIsStateLoaded] = useState(false)
    const {formData, onChange, setFormData, clearInputError} = useFormValue(initialState || {
        files: [],
        subject: "",
        purpose: "",
        date: "",
        amount: "",
        checkNum: "",
        comments: ""
    }, setError, error)

    useEffect(() => {
        console.log({initialState})
        if(initialState && !isStateLoaded) {
            setFormData(initialState)
            setIsStateLoaded(true)
        }
    }, [initialState]);


    const onSubmitForm = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const filterFiles = (value) => {
        const {length, ...files} = value
        let allFiles = Object.values(files)
        const filesArr = formData.files
            .filter(item => !item?.name || allFiles.every((file) => file.name !== item.name))
        return filesArr
    }

    const onClickUploadFile = (e) => {
        clearInputError('files')
        e.target.value = null
    }

    const onDeleteUploadedImage = (file) => {
        const filteredImages = formData.files.filter(item => item !== file)
        setFormData(prevState => ({
            ...prevState,
            files: filteredImages
        }))
    }

    const onUploadFile = (e) => {
        const filteredFiles = filterFiles(e.target.files)
        setFormData(prevState => ({
            ...prevState,
            files: [...filteredFiles, ...e.target.files]
        }))
    }


    return (
        <div className={`${styles["paymentForm"]} topDistanceBlock`}>
            <BackBtn/>
            <h2 className={`${styles["paymentForm__title"]} titleTxt`}>{title}</h2>
            <h6 className={`${styles["paymentForm__subtitle"]} subtitleTxt`}>{setCardNumText(curItem?.number)}</h6>
            {
                curItem ?
                    <div className={`${styles["paymentForm__main"]} blackBox`}>
                        <form
                            className={styles["paymentForm__form"]}
                            onSubmit={onSubmitForm}
                            method={'post'}
                            encType="multipart/form-data"
                        >
                            <p className={`${styles["paymentForm__infoText"]} contentTxt`}>Поля помеченные * -
                                обязательные</p>
                            <p className={`${styles["paymentForm__labelText"]} contentTxt`}>Выбрать файл *</p>
                            <label
                                className={
                                    `${styles["paymentForm__btn"]} mainBtn ` +
                                    `${error?.files ? styles["paymentForm__btn_invalid"] : ""}`
                                }
                                htmlFor="uploadFileInput"
                            >
                                <input
                                    id='uploadFileInput'
                                    type="file"
                                    multiple
                                    className={styles["paymentForm__fileUploadInput"]}
                                    onChange={e => onUploadFile(e)}
                                    onClick={onClickUploadFile}
                                />
                                <span>Загрузить файл</span>
                            </label>
                            <div className={styles["paymentForm__filesList"]}>

                                {
                                    formData?.files?.map((item) => {
                                        const fileName = item?.name || getFileName(item)
                                        return (
                                            <div className={styles["paymentForm__fileItem"]} key={fileName}>
                                                <p className={`${styles["paymentForm__fileName"]} contentTxt`}>Загружен
                                                    файл - {fileName}</p>
                                                <div
                                                    onClick={() => onDeleteUploadedImage(item)}
                                                    className={styles["paymentForm__cancelFileBtn"]}>
                                                    <Svg className={styles["paymentForm__cancelFileIcon"]}
                                                         id={crossIcon}/>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className={styles["paymentForm__fields"]}>
                                <div className={styles["paymentForm__field"]}>
                                    <p className={`${styles["paymentForm__labelText"]} contentTxt`}>Предмет (что
                                        куплено)*</p>
                                    <MainInput
                                        className={'mainInput_small'}
                                        isInvalid={error?.subject}
                                        value={formData.subject}
                                        onChange={onChange}
                                        name={'subject'}
                                    />
                                </div>
                                <div className={styles["paymentForm__field"]}>
                                    <p className={`${styles["paymentForm__labelText"]} contentTxt`}>Цель (для каких
                                        целей)*</p>
                                    <MainInput
                                        isInvalid={error?.purpose}
                                        value={formData.purpose}
                                        onChange={onChange}
                                        name={'purpose'}
                                        className={'mainInput_small'}
                                    />
                                </div>
                                <div className={styles["paymentForm__col"]}>
                                    <div className={styles["paymentForm__field"]}>
                                        <p className={`${styles["paymentForm__labelText"]} contentTxt`}>Дата*</p>
                                        <MainInput
                                            type={"date"}
                                            isInvalid={error?.date}
                                            value={formData.date}
                                            onChange={onChange}
                                            name={'date'}
                                            className={'mainInput_small'}
                                        />
                                    </div>
                                    <div className={styles["paymentForm__field"]}>
                                        <p className={`${styles["paymentForm__labelText"]} contentTxt`}>Сумма*</p>
                                        <MainInput
                                            type={"number"}
                                            isInvalid={error?.amount}
                                            value={formData.amount}
                                            onChange={onChange}
                                            name={'amount'}
                                            className={'mainInput_small'}
                                        />
                                    </div>
                                    <div className={styles["paymentForm__field"]}>
                                        <p className={`${styles["paymentForm__labelText"]} contentTxt`}>Номер
                                            операции*</p>
                                        <MainInput
                                            isInvalid={error?.checkNum}
                                            value={formData.checkNum}
                                            onChange={onChange}
                                            name={'checkNum'}
                                            className={'mainInput_small'}
                                        />
                                    </div>
                                </div>
                                <div className={styles["paymentForm__field"]}>
                                    <p className={`${styles["paymentForm__labelText"]} contentTxt`}>Комментарий
                                        (необязательно)</p>
                                    <MainInput
                                        isInvalid={error?.comments}
                                        value={formData.comments}
                                        onChange={onChange}
                                        name={'comments'}
                                        isTextArea={true}
                                        className={`mainInput_small ${styles["paymentForm__textArea"]}`}
                                    />
                                </div>
                            </div>
                            <MainBtn
                                type={"submit"}
                                className={`${styles["paymentForm__btn"]} ${styles["paymentForm__saveBtn"]}`}>Сохранить</MainBtn>
                        </form>
                    </div> :
                    <DataLoader loading={getLoading} isEmpty={!curItem}/>
            }
            <LoadingPopup show={loading}/>
        </div>
    );
}

export default PaymentForm;