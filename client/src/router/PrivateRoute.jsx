import React from 'react'
import {adminEmployeesPagePath, adminLoginPagePath, adminMainPagePath, loginPagePath, mainPagePath} from './path';
import { Navigate } from 'react-router-dom';
import {lsProps} from "../utils/lsProps";
import {getLSItem} from "../utils/functions/localStorage";

const PrivateRoute = ({element,noAuth,isAdmin}) => {
   const token = getLSItem(lsProps.token)
   const user = getLSItem(lsProps.user,true)
   const isAuthenticated = !token || !user
   const statement = noAuth ?
       !isAuthenticated :
       isAuthenticated  || (isAdmin && user.role !== 'admin') || (!isAdmin && user.role === 'admin')
   let navigateTo = loginPagePath

   if(!isAuthenticated) {
      navigateTo = -1
   } else {
      if(noAuth) {
         navigateTo = isAdmin ? adminMainPagePath : mainPagePath
      }
      if(isAdmin) navigateTo = `/admin${navigateTo}`
   }
   return (
       statement ? <Navigate to={navigateTo} replace={true} /> : element
   )
}

export default PrivateRoute