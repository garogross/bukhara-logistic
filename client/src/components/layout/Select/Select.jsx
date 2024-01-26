import {useDropdownSelect} from "../../../hooks/useDropdownSelect";

import Svg from "../Svg/Svg";
import TransitionProvider from "../../../providers/TransitionProvider";

import {arrowDownIcon} from "../../../assets/svg";
import styles from "./Select.module.scss";

function Select({
                    name,
                    valuesArr,
                    className,
                    attributes,
                    disableState,
                    selectedValueProp,
                    isInvalid,
                    onChange
                }) {
    const {
        selectedRef,
        dropDownOpened,
        disabled,
        onToggleDropdowns,
        onChangeSelectValues,
        sortedContentArr,
        btnText
    } = useDropdownSelect(
        {
            selectedValueProp,
            valuesArr,
            disableState,
            name,
            onChange
        })

    return (
        <div
            title={name || ''}
            ref={selectedRef}
            className={`${styles["select"]} ${disabled ? styles["select_disabled"] : ''}`}>
            <div
                className={`${styles["select__dropDownBtn"]} ${className ? className : ''} mainInput ${isInvalid ? 'mainInput_invalid' : ''}`}
                onClick={onToggleDropdowns}>
                <div className={styles['select__dropDownBtnContent']}>
                    <span className={styles["select__selectDropdownBtnText"]}>{btnText}</span>
                    {!disabled && <Svg
                        className={`${styles['select__arrowDownIcon']} ${dropDownOpened ? styles['select__arrowDownIcon_active'] : ''}`}
                        id={arrowDownIcon}/>}
                </div>
            </div>
            <TransitionProvider
                inProp={dropDownOpened}
                style='opacity'
                duration={100}
                className={styles["select__dropdownContent"]}
            >
                    <div
                        className={`${styles["select__dropdownContentItems"]} scrollbarDef`}>
                        {
                            sortedContentArr.map((item, index) => {
                                const itemContent = item.item
                                const itemValue = item?.value ? item?.value : item
                                return (
                                    <div
                                        {...attributes}
                                        key={index}
                                        className={styles["select__dropdownItem"]}
                                        onClickCapture={() => onChangeSelectValues(itemValue)}
                                    >{itemContent}</div>
                                )
                            })}
                    </div>
            </TransitionProvider>
        </div>
    )
}

export default Select;