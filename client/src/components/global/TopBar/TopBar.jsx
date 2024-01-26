import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../../../redux/action/auth";

import Svg from "../../layout/Svg/Svg";
import SecondaryBtn from "../../layout/SecondaryBtn/SecondaryBtn";

import {navLogoImage} from "../../../assets/images";
import {adminMainPagePath, loginPagePath, mainPagePath} from "../../../router/path";
import {logOutIcon} from "../../../assets/svg";
import styles from "./TopBar.module.scss"
import {setUserFullName} from "../../../utils/functions/setUserFullName";
import TransitionProvider from "../../../providers/TransitionProvider";
import {useEffect, useRef, useState} from "react";
import {onClickOutSide} from "../../../utils/functions/onClickOutSide";
import ChangePasswordModal from "./ChangePasswordModal/ChangePasswordModal";

function TopBar() {
    const dispatch = useDispatch()
    const {pathname} = useLocation()
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)

    const [optionsOpened, setOptionsOpened] = useState(false)
    const [updatePasModalOpened, setUpdatePasModalOpened] = useState(false)
    const optionsRef = useRef()

    useEffect(() => {
        onClickOutSide([optionsRef], closeOptions, optionsOpened)
    }, [optionsOpened]);

    const openOptions = () => setOptionsOpened(true)
    const closeOptions = () => setOptionsOpened(false)

    const openUpdatePasModal = () => {
        closeOptions()
        setUpdatePasModalOpened(true)
    }
    const closeUpdatePasModal = () => setUpdatePasModalOpened(false)

    const isLoggedIn = !pathname.includes('login')

    const isAdmin = pathname.includes('admin')


    const onLogOut = () => {
        dispatch(logOut(() => navigate(loginPagePath)))
    }


    return (
        <>
            <div className={`${styles["topBar"]} ${isLoggedIn ? styles["topBar_active"] : ""}`}>
                <div className={`${styles["topBar__container"]} container`}>
                    <button
                        onClick={() => navigate(isAdmin ? adminMainPagePath : mainPagePath)}
                        className={styles["topBar__logoBtn"]}>
                        <img src={navLogoImage} alt="logo" className={styles["topBar__logo"]}/>
                    </button>
                    {
                        isLoggedIn ?
                            <div className={styles['topBar__authBlock']}>
                                <div className={styles["topBar__usernameBlock"]} ref={optionsRef}>
                                    <button
                                        onClick={openOptions}
                                        className={styles["topBar__usernameBtn"]}>{setUserFullName(user?.fullName, user?.profession)}</button>

                                    <TransitionProvider
                                        className={styles["topBar__options"]}
                                        inProp={optionsOpened}
                                        style={"opacity"}
                                    >
                                        <SecondaryBtn onClick={openUpdatePasModal}>Изменить Пароль</SecondaryBtn>
                                    </TransitionProvider>
                                </div>
                                <SecondaryBtn
                                    className={styles["topBar__logoutBtnDesk"]}
                                    onClick={onLogOut}
                                >Выйти</SecondaryBtn>
                                <button
                                    className={styles["topBar__logoutBtnMob"]}
                                    onClick={onLogOut}
                                >
                                    <Svg className={styles["topBar__logoutIcon"]} id={logOutIcon}/>
                                </button>
                            </div> : null
                    }
                </div>
            </div>
            <ChangePasswordModal
                show={updatePasModalOpened}
                onClose={closeUpdatePasModal}
            />
        </>
    );
}

export default TopBar;