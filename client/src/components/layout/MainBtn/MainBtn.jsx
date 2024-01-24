import React, {memo} from 'react';

const MainBtn = memo(({className,isPassive,children,...properties}) => {
    return (
        <button
            className={`mainBtn ${isPassive ? "mainBtn_passive" : ''} ${className ? className : ''}`}
            {...properties}
        >{children}</button>
    );
})

export default MainBtn;