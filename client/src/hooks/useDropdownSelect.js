import {useEffect, useRef, useState} from "react";
import {onClickOutSide} from "../utils/functions/onClickOutSide";

export const useDropdownSelect = ({
                                      selectedValueProp,
                                      valuesArr,
                                      disableState,
                                      name,
                                      onChange
                                  }) => {
    const selectedRef = useRef(null)
    const [selectedValue, setSelectedValue] = useState(selectedValueProp ? selectedValueProp.value : '')
    const [dropDownOpened, setDropDownOpened] = useState(false)
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        onClickOutSide([selectedRef], oncloseDropdowns, dropDownOpened)
    }, [dropDownOpened])

    useEffect(() => {
        if (disableState) {
            setDisabled(disableState)
            setSelectedValue('')
        }
    }, [disableState])

    useEffect(() => {
        onChange(selectedValue)
    }, [selectedValue])

    const onToggleDropdowns = () => {
        if (!disabled) {
            setDropDownOpened(prevState => !prevState)
        }
    }

    const oncloseDropdowns = () => {
        setDropDownOpened(false)
    }

    const onChangeSelectValues = (value) => {
            setSelectedValue(value)
            oncloseDropdowns()
    }
    const valuesFiltered = valuesArr

    let btnText;
        if (selectedValue?.length) {
            btnText = valuesArr.find(item => item.value === selectedValue).item
        } else {
            btnText = name
        }

    return {
        selectedRef,
        dropDownOpened,
        disabled,
        onToggleDropdowns,
        oncloseDropdowns,
        onChangeSelectValues,
        btnText,
        selectedValue,
        sortedContentArr: valuesFiltered,
    }

}