import React from 'react';

import styles from "./Loader.module.scss";

function Loader({size,borderSize,className}) {

    const sizeStyle = size || 100
    const borderSizeStyle = borderSize || 10
    return (
        <div
            className={`${styles["loader"]} ${className ? className : ""}`}
            style={{width:sizeStyle, height:sizeStyle,borderWidth: borderSizeStyle}}
        ></div>
    );
}

export default Loader;