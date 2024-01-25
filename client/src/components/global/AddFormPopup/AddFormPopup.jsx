import React, {Fragment} from 'react';
import {useFormValue} from "../../../hooks/useFormValue";
import {setAddEmployeeError} from "../../../redux/action/users";

import Backdrop from "../../layout/Backdrop/Backdrop";
import NewPortalProvider from "../../../providers/NewPortalProvider";
import TransitionProvider from "../../../providers/TransitionProvider";
import CrossBtn from "../../layout/CrossBtn/CrossBtn";
import Loader from "../../layout/Loader/Loader";
import MainInput from "../../layout/MainInput/MainInput";
import MainBtn from "../../layout/MainBtn/MainBtn";

import styles from "./AddFormPopup.module.scss"
import Select from "../../layout/Select/Select";
import {userRoles} from "../../../constants";

function AddFormPopup({
                          show,
                          onClose,
                          fields,
                          title,
                          loading,
                          error,
                          onSubmit,
    setError
                      }) {
    const initialData = fields.reduce((acc, cur) => {
        acc[cur.key] = ""
        return acc;
    }, {})
    const {formData, onChange,setFormData, onResetForm} = useFormValue(initialData,
        setError, error)

    const onClosePopup = () => {
            onResetForm()
            onClose()
    }
    const onSubmitForm = (e) => {
        e.preventDefault()

        onSubmit(formData, onClosePopup)
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
                            fields.map(({placeholder, key, isCard,type,selectValues,inputType}) => (
                                <Fragment key={key}>
                                    {
                                        type === 'select' ?
                                            <Select
                                                disableState={false}
                                                valuesArr={selectValues}
                                                selectedValueProp={selectValues.find(item => item.value === userRoles.employee) || null}
                                                onChange={(value) => setFormData(prevState => ({
                                                    ...prevState,
                                                    [key]: value
                                                }))}
                                                name={'Пусто'}
                                            /> :
                                            <MainInput
                                                data-text={key}
                                                maxLength={isCard ? 4 : null}
                                                isInvalid={error?.[key]}
                                                disabled={loading}
                                                placeholder={placeholder}
                                                value={formData[key]}
                                                name={key}
                                                type={inputType || "text"}
                                                onChange={onChange}
                                            />
                                    }
                                </Fragment>
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