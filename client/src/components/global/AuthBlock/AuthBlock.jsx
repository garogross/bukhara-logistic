import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useFormValue} from "../../../hooks/useFormValue";
import {login} from "../../../redux/action/auth";

import MainBtn from "../../layout/MainBtn/MainBtn";
import Svg from "../../layout/Svg/Svg";
import MainInput from "../../layout/MainInput/MainInput";
import LoadingPopup from "../../layout/LoadingPopup/LoadingPopup";

import {emailImage, passwordImage,} from "../../../assets/images";
import {errorIcon} from "../../../assets/svg";
import {adminMainPagePath, mainPagePath} from "../../../router/path";
import styles from "./AuthBlock.module.scss"

const fields = [
    {
        key: "username",
        placeholder: "Username",
        img: emailImage
    },
    {
        type: 'password',
        key: "password",
        placeholder: "Пароль",
        img: passwordImage
    },
]

function AuthBlock({
                       isAdmin,
                   }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const error = useSelector(state => state.auth.loginError)
    const loading = useSelector(state => state.auth.loginLoading)
    const initialState = fields.reduce((acc, cur) => {
        acc[cur.key] = ""
        return acc;
    }, {})
    const {formData, onChange} = useFormValue(initialState)

    const onSubmitForm = (e) => {
        e.preventDefault()
        const onSuccess = () => {
            const navigateTo = isAdmin ? adminMainPagePath : mainPagePath
            navigate(navigateTo)
        }
        dispatch(login(formData,onSuccess,isAdmin))
    }


    let errorText = ""
    if (error) {
        if (error?.message?.message) errorText = error.message.message
        else if (typeof error === 'string')  errorText = error
    }

    return (
        <>
            <div className={`${styles["authBlock"]} gradientBg`}>
                <div className={styles["authBlock__main"]}>
                    <div className={styles["authBlock__mainContainer"]}>
                        <h3 className={styles["authBlock__title"]}>
                            Войти в <span className={'blueText'}>аккаунт {isAdmin ? 'Как Админ' : ""}
                        </span>
                        </h3>
                        <form
                            autoComplete={'off'}
                            method='POST'
                            onSubmit={onSubmitForm}
                        >
                            {
                                fields.map(({type, placeholder, img, key}, index) => (
                                    <MainInput
                                        key={index}
                                        type={type || "text"}
                                        className={styles["authBlock__input"]}
                                        placeholder={placeholder}
                                        icon={img}
                                        value={formData[key]}
                                        name={key}
                                        onChange={onChange}
                                    />
                                ))
                            }
                            <MainBtn className={styles["authBlock__submitBtn"]} type={"submit"}>
                                Войти
                            </MainBtn>
                        </form>
                    </div>
                    <div
                        className={`${styles["authBlock__errorBlock"]} ${error ? styles["authBlock__errorBlock_active"] : ''}`}>
                        <div className={styles["authBlock__errorBox"]}>
                            <Svg className={styles["authBlock__errorIcon"]} id={errorIcon}/>
                            <p className={styles["authBlock__errorBoxText"]}>{errorText}</p>
                        </div>
                    </div>
                </div>
            </div>
            <LoadingPopup show={loading}/>
        </>
    );
}

export default AuthBlock;