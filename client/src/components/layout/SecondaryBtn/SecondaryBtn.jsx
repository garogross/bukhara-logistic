import React, {memo} from 'react';

import styles from "./SecondaryBtn.module.scss"

const SecondaryBtn = memo(({className,children,...properties}) => {
    return (
        <button
            className={`${styles['secondaryBtn']} ${className ? className : ''}`}
            {...properties}
        >{children}</button>
    );
})

export default SecondaryBtn;