import React, {Fragment, useEffect} from "react";
import {checkIsLoggedIn} from "../../redux/action/auth";
import {useDispatch} from "react-redux";
import {Outlet, Route, Routes} from 'react-router-dom';

import TopBar from "../global/TopBar/TopBar";

import {routes} from "../../router/path";

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(checkIsLoggedIn())
    }, []);

    return (
        <>
            <TopBar/>
            <Routes>
                {
                    routes.map(({path, component, children}, index) => (
                        <Fragment key={index}>
                            {
                                children ?
                                    <Route path={path} element={<Outlet/>}>
                                        <Route index element={component}/>
                                        {
                                            children.map((child,childIndex) => (
                                                <Route path={child.path} element={child.component} key={childIndex}/>
                                            ))
                                        }
                                    </Route>
                                    :
                                    <Route path={path} element={component}/>
                            }
                        </Fragment>
                    ))
                }
            </Routes>
        </>
    );
}

export default App;