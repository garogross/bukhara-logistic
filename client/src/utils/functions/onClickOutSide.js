export const onClickOutSide = (ref, onCloseState, state) => {
    const checkIfClickedOutside = (e) => {
        const isRef = ref.every(value => value.current
            && !value.current.contains(e.target)
        )
        if (state && isRef) {
            onCloseState()
        }
    }
    document.addEventListener('click', checkIfClickedOutside)

    return () => {
        document.removeEventListener('click', checkIfClickedOutside)
    }
}