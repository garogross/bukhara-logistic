import MainPage from "../pages/MainPage/MainPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import PrivateRoute from "./PrivateRoute";
import AdminLoginPage from "../pages/Admin/AdminLoginPage/AdminLoginPage";
import AddPaymentPage from "../pages/AddPaymentPage/AddPaymentPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import PaymentsPage from "../pages/PaymentsPage/PaymentsPage";
import {Navigate} from "react-router-dom";
import React from "react";
import AdminEmployeesPage from "../pages/Admin/AdminEmployeesPage/AdminEmployeesPage";
import AdminPaymentsPage from "../pages/Admin/AdminPaymentsPage/AdminPaymentsPage";

export const mainPagePath = '/'
export const loginPagePath = '/login'
export const paymentsPagePath = '/payments'
export const addPaymentPagePath = '/addPayment'

// админ
export const adminLoginPagePath = '/admin/login'
export const adminMainPagePath = '/admin/'
export const adminPaymentsPagePath = '/admin/payments'

export const routes = [
    {
        path: loginPagePath,
        component: <PrivateRoute element={<LoginPage/>} noAuth={true}/>
    },
    {
        path: mainPagePath,
        component: <PrivateRoute element={<MainPage/>}/>
    },
    {
        path: paymentsPagePath,
        component: <PrivateRoute
            element={
                <Navigate
                    to={mainPagePath}
                    replace={true}
                />
            }
        />,
        children: [
            {
                path: ":id",
                component: <PrivateRoute element={<PaymentsPage/>}/>
            }
        ]
    },
    {
        path: addPaymentPagePath,
        component: <PrivateRoute
            element={
                <Navigate
                    to={mainPagePath}
                    replace={true}
                />
            }
        />,
        children: [
            {
                path: ":id",
                component: <PrivateRoute element={<AddPaymentPage/>}/>
            }
        ]
    },
    {
        path: adminLoginPagePath,
        component: <PrivateRoute element={<AdminLoginPage/>} noAuth={true} isAdmin={true}/>
    },
    {
        path: adminMainPagePath,
        component: <PrivateRoute element={<AdminEmployeesPage/>} isAdmin={true}/>
    },
    {
        path: adminPaymentsPagePath,
        component: <PrivateRoute
            element={
                <Navigate
                    to={adminMainPagePath}
                    replace={true}
                />
            }
        />,
        children: [
            {
                path: ":id",
                component: <PrivateRoute element={<AdminPaymentsPage/>} isAdmin={true}/>
            }
        ]
    },
    // ///
    {
        path: '*',
        component: <ErrorPage/>
    },
]