import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../../../redux/action/auth";

import Svg from "../../layout/Svg/Svg";
import SecondaryBtn from "../../layout/SecondaryBtn/SecondaryBtn";

import {navLogoImage} from "../../../assets/images";
import {adminLoginPagePath, adminMainPagePath, loginPagePath, mainPagePath} from "../../../router/path";
import {logOutIcon} from "../../../assets/svg";
import styles from "./TopBar.module.scss"

function TopBar() {
    const dispatch = useDispatch()
    const {pathname} = useLocation()
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)

    const isLoggedIn = !pathname.includes('login')

    const isAdmin = pathname.includes('admin')

    const loginPath = isAdmin ? adminLoginPagePath : loginPagePath

    const onLogOut = () => {
        dispatch(logOut(() => navigate(loginPath)))
    }
    return (
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
                            <h5 className={styles["topBar__usernameText"]}>{user?.fullName}</h5>
                            <SecondaryBtn
                                className={styles["topBar__logoutBtnDesk"]}
                                onClick={onLogOut}
                            >Log Out</SecondaryBtn>
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
    );
}

export default TopBar;