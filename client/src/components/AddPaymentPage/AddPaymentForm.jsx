import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useFormValue} from "../../hooks/useFormValue";
import {setCardNumText} from "../../utils/functions/card";
import {getCards} from "../../redux/action/cards";
import {addPayment, setAddPaymentError} from "../../redux/action/payments";

import MainBtn from "../layout/MainBtn/MainBtn";
import MainInput from "../layout/MainInput/MainInput";
import LoadingPopup from "../layout/LoadingPopup/LoadingPopup";
import DataLoader from "../layout/DataLoader/DataLoader";
import Svg from "../layout/Svg/Svg";

import {crossIcon} from "../../assets/svg";
import {paymentsPagePath} from "../../router/path";
import styles from "./AddPaymentForm.module.scss"


function AddPaymentForm() {
    const dispatch = useDispatch()
    const {id} = useParams()
    const navigate = useNavigate()

    const cardLoading = useSelector(state => state.cards.getLoading)
    const addLoading = useSelector(state => state.payments.addLoading)
    const error = useSelector(state => state.payments.addError)
    const cards = useSelector(state => state.cards.data)

    const {formData, onChange, setFormData,clearInputError} = useFormValue({
        files: [],
        subject: "",
        purpose: "",
        date: "",
        amount: "",
        checkNum: "",
        comments: ""
    },setAddPaymentError,error)

    const curCard = cards.find(item => item._id === id)

    useEffect(() => {
        if (!cards.length) dispatch(getCards())
    }, []);

    const filterFiles = (value) => {
        const {length, ...files} = value
        let allFiles = Object.values(files)
        const filesArr = formData.files.filter(item => allFiles.every((file, index) => file.name !== item.name))
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
        // clearInputError('image')
        setFormData(prevState => ({
            ...prevState,
            files: [...filteredFiles, ...e.target.files]
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const onSuccess = () => navigate(paymentsPagePath+"/"+id)
        dispatch(addPayment({...formData, card: id},onSuccess))
    }

    return (
        <div className={`${styles["addPaymentForm"]} topDistanceBlock`}>
            <h2 className={`${styles["addPaymentForm__title"]} titleTxt`}>Добавление Списаний</h2>
            <h6 className={`${styles["addPaymentForm__subtitle"]} subtitleTxt`}>{setCardNumText(curCard?.number)}</h6>
            {
                curCard ?
                    <div className={`${styles["addPaymentForm__main"]} blackBox`}>
                        <form
                            className={styles["addPaymentForm__form"]}
                            onSubmit={onSubmit}
                            method={'post'}
                            encType="multipart/form-data"
                        >
                            <p className={`${styles["addPaymentForm__infoText"]} contentTxt`}>Поля помеченные * -
                                обязательные</p>
                            <p className={`${styles["addPaymentForm__labelText"]} contentTxt`}>Выбрать файл *</p>
                            <label
                                className={
                                `${styles["addPaymentForm__btn"]} mainBtn ` +
                                `${error?.files ? styles["addPaymentForm__btn_invalid"] : ""}`
                            }
                                htmlFor="uploadFileInput"
                            >
                                <input
                                    id='uploadFileInput'
                                    type="file"
                                    multiple
                                    className={styles["addPaymentForm__fileUploadInput"]}
                                    onChange={e => onUploadFile(e)}
                                    onClick={onClickUploadFile}
                                />
                                <span>Загрузить файл</span>
                            </label>
                            <div className={styles["addPaymentForm__filesList"]}>

                                {
                                    formData.files.map((item) => (
                                        <div className={styles["addPaymentForm__fileItem"]} key={item.name}>
                                            <p className={`${styles["addPaymentForm__fileName"]} contentTxt`}>Загружен
                                                файл - {item.name}</p>
                                            <button
                                                onClick={() => onDeleteUploadedImage(item)}
                                                className={styles["addPaymentForm__cancelFileBtn"]}>
                                                <Svg className={styles["addPaymentForm__cancelFileIcon"]}
                                                     id={crossIcon}/>
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className={styles["addPaymentForm__fields"]}>
                                <div className={styles["addPaymentForm__field"]}>
                                    <p className={`${styles["addPaymentForm__labelText"]} contentTxt`}>Предмет (что
                                        куплено)*</p>
                                    <MainInput
                                        isInvalid={error?.subject}
                                        value={formData.subject}
                                        onChange={onChange}
                                        name={'subject'}
                                    />
                                </div>
                                <div className={styles["addPaymentForm__field"]}>
                                    <p className={`${styles["addPaymentForm__labelText"]} contentTxt`}>Цель (для каких
                                        целей)*</p>
                                    <MainInput
                                        isInvalid={error?.purpose}
                                        value={formData.purpose}
                                        onChange={onChange}
                                        name={'purpose'}
                                        className={styles["addPaymentForm__input"]}
                                    />
                                </div>
                                <div className={styles["addPaymentForm__col"]}>
                                    <div className={styles["addPaymentForm__field"]}>
                                        <p className={`${styles["addPaymentForm__labelText"]} contentTxt`}>Дата*</p>
                                        <MainInput
                                            type={"date"}
                                            isInvalid={error?.date}
                                            value={formData.date}
                                            onChange={onChange}
                                            name={'date'}
                                            className={styles["addPaymentForm__input"]}
                                        />
                                    </div>
                                    <div className={styles["addPaymentForm__field"]}>
                                        <p className={`${styles["addPaymentForm__labelText"]} contentTxt`}>Сумма*</p>
                                        <MainInput
                                            type={"number"}
                                            isInvalid={error?.amount}
                                            value={formData.amount}
                                            onChange={onChange}
                                            name={'amount'}
                                            className={styles["addPaymentForm__input"]}
                                        />
                                    </div>
                                    <div className={styles["addPaymentForm__field"]}>
                                        <p className={`${styles["addPaymentForm__labelText"]} contentTxt`}>Номер
                                            чека*</p>
                                        <MainInput
                                            isInvalid={error?.checkNum}
                                            value={formData.checkNum}
                                            onChange={onChange}
                                            name={'checkNum'}
                                            className={styles["addPaymentForm__input"]}
                                        />
                                    </div>
                                </div>
                                <div className={styles["addPaymentForm__field"]}>
                                    <p className={`${styles["addPaymentForm__labelText"]} contentTxt`}>Комментарий
                                        (необязательно)</p>
                                    <MainInput
                                        isInvalid={error?.comments}
                                        value={formData.comments}
                                        onChange={onChange}
                                        name={'comments'}
                                        isTextArea={true}
                                        className={`${styles["addPaymentForm__input"]} ${styles["addPaymentForm__textArea"]}`}
                                    />
                                </div>
                            </div>
                            <MainBtn
                                type={"submit"}
                                className={`${styles["addPaymentForm__btn"]} ${styles["addPaymentForm__saveBtn"]}`}>Сохранить</MainBtn>
                        </form>
                    </div> :
                    <DataLoader loading={cardLoading} isEmpty={!curCard}/>
            }
            <LoadingPopup show={addLoading}/>
        </div>
    );
}

export default AddPaymentForm;