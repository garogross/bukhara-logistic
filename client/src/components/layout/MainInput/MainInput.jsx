import React, {memo} from 'react';

const MainInput = memo(({
                            className,
                            isInvalid,
                            onChange,
                            value,
                            icon,
                            isTextArea,
                            ...properties
                        }) => {
    const InputElement = isTextArea ? 'textarea' : 'input';


    return (
        <InputElement
            onChange={onChange}
            value={value}
            style={{backgroundImage: icon ? `url(${icon})` : 'none'}}
            className={
                `mainInput ${className ? className : ''} ` +
                `${isInvalid ? 'mainInput_invalid' : ""} ` +
                `${icon ? 'mainInput_withIcon' : ""}` +
                `${isTextArea ? 'scrollbarDef' : ""}`
            }
            {...properties}

        />
    );
})

export default MainInput;