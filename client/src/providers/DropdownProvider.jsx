import React, {useEffect, useRef, useState} from 'react';

function DropdownProvider({inProp, duration, children, className, delay,childClass,minHeight,addHeight = 0}) {
    const [contentHeight, setContentHeight] = useState(0)
    const contentRef = useRef(null)

    const durationTime = duration || 500
    const delayState = delay || 0


    useEffect(() => {
        changeHeight()
        window.addEventListener('resize', changeHeight)

        return () => {
            window.removeEventListener('resize', changeHeight)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inProp])

    const changeHeight = () => setContentHeight((inProp && !minHeight) || (inProp && contentRef.current?.clientHeight < minHeight) ? contentRef.current?.clientHeight : 0)


    const contentStyle = {
        height: `${contentHeight + addHeight}px`,
        transition: `height ${durationTime}ms ${delayState}ms`
    }
    return (
        <div style={contentStyle} className={className ? className : ''}>
            <div ref={contentRef} className={childClass ? childClass : ''}>
                {children}
            </div>
        </div>
    );
}

export default DropdownProvider;