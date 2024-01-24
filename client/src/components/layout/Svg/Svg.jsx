import React from 'react'

import sprite from "../../../assets/svg/sprite.svg"

const Svg = ({className,id}) => {
    return (
        <svg className={className}>
            <use href={`${sprite}#${id}`} />
        </svg>
    )
}

export default Svg
