import React from 'react';
import {useFormValue} from "../../../../hooks/useFormValue";
import {setAddEmployeeError} from "../../../../redux/action/users";

import Backdrop from "../../../layout/Backdrop/Backdrop";
import NewPortalProvider from "../../../../providers/NewPortalProvider";
import TransitionProvider from "../../../../providers/TransitionProvider";
import CrossBtn from "../../../layout/CrossBtn/CrossBtn";
import Loader from "../../../layout/Loader/Loader";
import MainInput from "../../../layout/MainInput/MainInput";
import MainBtn from "../../../layout/MainBtn/MainBtn";

import styles from "./AddFormPopup.module.scss"

function AddFormPopup({
                          show,
                          onClose,
                          fields,
                          title,
                          loading,
                          error,
                          onSubmit
                      }) {
    const initialData = fields.reduce((acc, cur) => {
        acc[cur.key] = ""
        return acc;
    }, {})
    const {formData, onChange,setFormData, onResetForm} = useFormValue(initialData, setAddEmployeeError, error)

    const onClosePopup = () => {
            onResetForm()
            onClose()
    }
    const onSubmitForm = (e) => {
        e.preventDefault()

        onSubmit(formData, onClosePopup)
    }

    const onCardChange = (e) => {
        const cleanedInput = e.target.value.replace(/\D/g, '');
        let formattedInput = e.target.value[e.target.value.length - 1] === " " ?
            e.target.value.trim() :
            cleanedInput.replace(/(\d{4})/g, '$1 ').trim();

        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: formattedInput
        }))
    }

    return (
        <>
            <Backdrop onClose={onClosePopup} inProp={show}/>
            <NewPortalProvider>
                <TransitionProvider
                    className={`${styles["addFormPopup"]} popupBox`}
                    inProp={show}
                    style={'opacity'}
                >
                    <CrossBtn onClick={onClosePopup}/>
                    <h4 className={`popupTitle`}>{title}</h4>
                    <form
                        className={styles["addFormPopup__form"]}
                        onSubmit={onSubmitForm}
                    >
                        {
                            fields.map(({placeholder, key, isCard}, index) => (
                                <MainInput
                                    key={key}
                                    maxLength={isCard ? 19 : null}
                                    isInvalid={error?.[key]}
                                    disabled={loading}
                                    placeholder={placeholder}
                                    value={formData[key]}
                                    name={key}
                                    onChange={isCard ? onCardChange : onChange}
                                />
                            ))
                        }
                        <TransitionProvider
                            inProp={loading}
                            style={"height"}
                            height={"36px"}
                        >
                            <Loader size={36} borderSize={4}/>
                        </TransitionProvider>
                        <MainBtn
                            disabled={loading}
                            type={"submit"}
                            className={styles["addFormPopup__btn"]}
                        >Сохранить</MainBtn>
                    </form>
                </TransitionProvider>
            </NewPortalProvider>
        </>
    );
}

export default AddFormPopup;